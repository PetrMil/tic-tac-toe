/* 
про i? 
про важность immutability ?
*/
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {
  console.log(props);
  return (
    <button className={"square " + (props.winner ? "winner":"")} onClick={props.onClick}>
      {props.value}
    </button>
  );
}


//////////////////////////////////////////////////////////////
class Board extends React.Component {

  renderSquare(i) {
    let moves = this.props.moves;
    let winnerMove = moves && moves.indexOf(i);
    console.log(winnerMove,moves);
    return(
      <Square 
        value={this.props.squares[i]}// i??
        onClick={() => this.props.onClick(i)}
        winner={winnerMove !==null && winnerMove > -1 }

      />
    );
  }

  makeLoops() {
    var loop;
    var loop2=[];
    for (var i = 0; i < 3; i++) {
      loop = []; 
      for (var j = 0; j < 3; j++) { 
        loop.push(this.renderSquare(3*i+j));
      }
      loop2.push(<div className="board-row">{loop}</div>);
    }
    return loop2; 
  }

  render() { 
    return ( 
      <div> 
        {this.makeLoops()} 
      </div> 
    ); 
  }
}

/////////////////////////////////////////////////
class Game extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      history: [{ 
        squares: Array(9).fill(null),
      }],  
      xIsNext: true,
      stepNumber: 0, 
      sort: "ascending",
      champion: null
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);//+1?
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    let w=this.calculateWinner(squares);
    if (w || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
    });
    
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  eventClick(){
    const newText=this.state.sort === "ascending" ? "descending" : "ascending"
    this.setState({sort: newText })
  }

  calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return {
          winner:squares[a],
          moves:lines[i]
        } 
      }
    }
    return null;
  }
  render() {

    let history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = this.calculateWinner(current.squares);
    const moves = history.map((step, move) => {
      if (this.state.sort === "descending") {
        move = history.length-1-move;
      }
      const desc = move ? 'Go to move #' + move :'Go to game start';

      return (
        <li key={move}>
          <span>{move}. </span>
          <button  onClick={() => this.jumpTo(move)} className={this.state.stepNumber === move ? "choosen":"non-choosen"}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner.winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            moves={winner && winner.moves}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={()=>this.eventClick()} className="order">{"Change to " + (this.state.sort === "ascending" ? "descending" : "ascending") + " order"}</button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}


// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

