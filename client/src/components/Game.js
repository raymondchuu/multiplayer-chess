import React from 'react';
import Board from './Board';
import initializeChessBoard from '../helpers/InitializeChessBoard';
import Rook from '../pieces/Rook';
import Queen from '../pieces/Queen';
import queryString from 'query-string';
import { socket } from '../socket/socket';

export default class Game extends React.Component {
    constructor() {
        super();
    
        this.state = {
          squares: initializeChessBoard(),
          playerTurn: 1,
          selectedIndex: -1,
          king1InCheck: false,
          player1: "",
          player2: "",
          usernames: [],
          start: false
        }
    }

    componentDidMount() {
      socket.emit("shouldGameStart", this.props.gameId);
      console.log("shouldgamestart emitted!");

      socket.on("start game", (users) => {
        this.setState({
          start: true,
          player1: users[0],
          player2: users[1],
          usernames: users
        });
      });
    
      socket.on("userMove", (state) => {
        this.setState({
          squares: state.squares,
          selectedIndex: state.selectedIndex,
          playerTurn: state.playerTurn,
        }, console.log(this.state));
      }) 
    }

    handleEnPassant(squares, index) {
        if (this.state.playerTurn === 1) {
          //left en passant
          if (index === this.state.selectedIndex - 9) {
            squares[index] = squares[this.state.selectedIndex];
            squares[this.state.selectedIndex] = null;
            squares[index + 8] = null;
          }
        
          //right en passant
          if (index === this.state.selectedIndex - 7) {
            squares[index] = squares[this.state.selectedIndex];
            squares[this.state.selectedIndex] = null;
            squares[index + 8] = null;
          }
        }
    
        else {
          //left en passant
          if (index === this.state.selectedIndex + 7) {
            squares[index] = squares[this.state.selectedIndex];
            squares[this.state.selectedIndex] = null;
            squares[index - 8] = null;
          }
    
          //right en passant
          if (index === this.state.selectedIndex + 9) {
            squares[index] = squares[this.state.selectedIndex];
            squares[this.state.selectedIndex] = null;
            squares[index - 8] = null;
          }
        }
    
        return squares;
    }
    
    checkEnPassant(squares, index) {
        const enPassantPositions = {
          1: [24, 25, 26, 27, 28, 29, 30, 31],
          2: [32, 33, 34, 35, 36, 37, 38, 39]
        }
        const otherPlayer = this.state.playerTurn === 1 ? 2 : 1;
    
        if (squares[this.state.selectedIndex].name === "Pawn" && enPassantPositions[1].indexOf(this.state.selectedIndex) >= 0 && this.state.playerTurn === 1) {
          //left en passant
          console.log("first check");
          console.log(squares[this.state.selectedIndex - 9] === index);
          if (squares[this.state.selectedIndex - 1] !== null && squares[this.state.selectedIndex - 1].name === "Pawn" && squares[this.state.selectedIndex - 1].player === otherPlayer && squares[this.state.selectedIndex - 1].doubleJump && index === this.state.selectedIndex - 9) {
            console.log("second check");
            return true;
          }
          if (squares[this.state.selectedIndex + 1] !== null && squares[this.state.selectedIndex + 1].name === "Pawn" && squares[this.state.selectedIndex + 1].player === otherPlayer && squares[this.state.selectedIndex + 1].doubleJump && index === this.state.selectedIndex - 7) {
            return true;
          }
        }
    
        if (squares[this.state.selectedIndex].name === "Pawn" && enPassantPositions[2].indexOf(this.state.selectedIndex) >= 0 && this.state.playerTurn === 2) {
          if (squares[this.state.selectedIndex - 1] !== null && squares[this.state.selectedIndex - 1].name === "Pawn" && squares[this.state.selectedIndex - 1].player === otherPlayer && squares[this.state.selectedIndex - 1].doubleJump && index === this.state.selectedIndex + 7) {
            return true;
          }      
          if (squares[this.state.selectedIndex - 1] !== null && squares[this.state.selectedIndex - 1].name === "Pawn" && squares[this.state.selectedIndex - 1].player === otherPlayer && squares[this.state.selectedIndex - 1].doubleJump && index === this.state.selectedIndex + 9) {
            return true;
          }
        }
    
        return false;
    }
    
    isMyKinginCheck(squares, check) {
        return new Promise((resolve, reject) => {
    
        var kingIndex = -1;
        var otherPlayer = this.state.playerTurn === 1 ? 2 : 1;
        for (var i = 0; i < squares.length && kingIndex < 0; ++i) {
          if (squares[i] !== null && squares[i].name === "King" && squares[i].player === this.state.playerTurn) {
            kingIndex = i;
          }
        }
        
        var found = false;
        console.log(kingIndex);
    
        for (var j = 0; j < squares.length && !found; ++j) {
          if (squares[j] !== null && squares[j].player === otherPlayer) {
            const validMove = squares[j].isMoveValid(j, kingIndex, true);
            const path = squares[j].getPathIndicies(j, kingIndex);
            if (validMove) {
              const validPath = this.checkValidPath(squares, path);
              console.log(j, kingIndex, squares[42])
              if (validPath) {
                found = true;
              }
            }
          }
        }
    
        if (found) {
          squares[kingIndex].style = {...squares[kingIndex].style, backgroundColor: 'red'}
          check = true;
        }
        else {
          squares[kingIndex].style = {...squares[kingIndex].style, backgroundColor: null}
          check = false;
        }
        resolve(check);
      })
    }
    
    checkValidPath(squares, path) {
        var valid = true;
        
        for (var i = 0; i < path.length && valid; ++i) {
          if (squares[path[i]] !== null) {
            valid = false;
          }
        }
    
        return valid;
    }
    
    checkRook(squares, index) {
        if (index === 6 || index === 62) {
          if (squares[index + 1].name === "Rook" && !squares[index + 1].moved()) {
            return true;
          }
        }
    
        if (index === 2 || index === 58) {
          if (squares[index - 2].name === "Rook" && !squares[index - 2].moved()) {
            return true;
          }
        }
    }
    
    checkCastle(squares, index) {
        if (this.state.selectedIndex === 4 || this.state.selectedIndex === 60) {
          if (!squares[63].moved() || !squares[56].moved() || !squares[0].moved() || !squares[7].moved()) {
            //short castle
            if (index === 62) {
              if (this.checkRook(squares, index)) {
                if (squares[61] === null && squares[62] === null) {
                  squares[index] = squares[this.state.selectedIndex];
                  squares[index].handleMoved();
                  squares[this.state.selectedIndex] = null;
                  squares[61] = new Rook(1);
                  squares[63] = null;
                }
    
                else {
                  return false;
                }
              }
            }
    
            if (index === 6) {
              if (this.checkRook(squares, index)) {
                if (squares[5] === null && squares[6] === null) {
                  squares[index] = squares[this.state.selectedIndex];
                  squares[index].handleMoved();
                  squares[this.state.selectedIndex] = null;
                  squares[5] = new Rook(2);
                  squares[7] = null;
                }
                else {
                  return false;
                }
              }
            }
    
            //Long castle
            if (index === 2) {
              if (this.checkRook(squares, index)) {
                if (squares[1] === null && squares[2] === null && squares[3] === null) {
                  squares[index] = squares[this.state.selectedIndex];
                  squares[index].handleMoved();
                  squares[this.state.selectedIndex] = null;
                  squares[3] = new Rook(2);
                  squares[0] = null;
                }
                else {
                  return false;
                }
              }
            }
    
            if (index === 58) {
              if (this.checkRook(squares, index)) {
                if (squares[57] === null && squares[58] === null && squares[59] === null) {
                  squares[index] = squares[this.state.selectedIndex];
                  squares[index].handleMoved();
                  squares[this.state.selectedIndex] = null;
                  squares[59] = new Rook(1);
                  squares[56] = null;
                }
                else {
                  return false;
                }
              }
            }
    
            return squares;
          }
        }
    }
    
    
    handleClick(index) {
        //shallow copy squares 
        const squares = this.state.squares.slice();
    
        console.log(index);
        //highlight chess piece
        if (this.state.selectedIndex < 0) {
          if (squares[index] && (squares[index].player === this.state.playerTurn)) {
            squares[index].style = {...squares[index].style, backgroundColor: "#575E6B" };
            this.setState({
              squares: squares,
              selectedIndex: index
            });
          }
          else {
            console.log("That is not your piece");
          }
        }
    
        //piece has been selected
        else {
          squares[this.state.selectedIndex].style = {...squares[this.state.selectedIndex].style, backgroundColor: null};
    
          // castling king and rook
          if (squares[this.state.selectedIndex] !== null && squares[this.state.selectedIndex].name === "King" && !squares[this.state.selectedIndex].moved() && (index === 2 || index === 6 || index === 58 || index === 62)) {
            const newSquares = this.checkCastle(squares, index);
            if (newSquares) {
              var nextTurn = this.state.playerTurn === 1 ? 2 : 1;
              this.setState({
                squares: newSquares,
                selectedIndex: -1,
                playerTurn: nextTurn
              })
            }
            else {
              console.log("invalid move");
              this.setState({
                selectedIndex: -1
    
              })
            }
          }
    
          //en passant
          else if (this.checkEnPassant(squares, index)) {
            const newSquares = this.handleEnPassant(squares, index);
            var nextTurn = this.state.playerTurn === 1 ? 2 : 1;
            this.setState({
              squares: newSquares,
              selectedIndex: -1,
              playerTurn: nextTurn
            }) 
          }
    
          //if destination of piece is clicked on own piece
          else if (squares[index] !== null && squares[index].player === this.state.playerTurn) {
            console.log("That's your own piece wtf");
            this.setState({
              squares: squares, 
              selectedIndex: -1
            })
          }
    
          // if destination is not on own piece
          else {
            console.log(squares[this.state.selectedIndex]);
            const lastRows = {
              1: [0, 1, 2, 3, 4, 5, 6, 7],
              2: [56, 57, 58, 59, 60, 61, 62, 63]
            };
            const isSquareOccupied = squares[index] === null ? false : true;
            const validMove = squares[this.state.selectedIndex].isMoveValid(this.state.selectedIndex, index, isSquareOccupied);
            const pathIndicies = squares[this.state.selectedIndex].getPathIndicies(this.state.selectedIndex, index);
            if (validMove) {
              const validPath = this.checkValidPath(squares, pathIndicies);
              if (validPath) {
                squares[index] = squares[this.state.selectedIndex];
                squares[index].handleMoved();
                squares[this.state.selectedIndex] = null;
                console.log(squares[index]);
    
                // pawn to queen
                if (squares[index].name === "Pawn" && lastRows[1].indexOf(index) >= 0) {
                  squares[index] = null;
                  squares[index] = new Queen(1);
                }
                if (squares[index].name === "Pawn" && lastRows[2].indexOf(index) >= 0) {
                  squares[index] = null;
                  squares[index] = new Queen(2);
                }
    
                // check if king is in check with shallow copied board
                this.isMyKinginCheck(squares)
                .then((check) =>{
                  console.log(check);
                  if (check) {
                    console.log("Move your king white!");
                    squares[this.state.selectedIndex] = squares[index];
                    squares[index] = null
                    this.setState({
                      squares: squares,
                      selectedIndex: -1,
                      king1InCheck: check
                    })
                  }
                  else {
                    var nextTurn = this.state.playerTurn === 1 ? 2 : 1;
                    this.setState({
                      playerTurn: nextTurn,
                      selectedIndex: -1,
                      squares: squares
                    });
                    
                    socket.emit('move', {
                      selectedIndex: -1,
                      playerTurn: nextTurn,
                      squares: squares,
                      gameId: this.props.gameId
                    })
                  }
                }) 
                .catch((err) => {
                  console.log(err);
                })        
              }
              else {
                console.log("invalid path", pathIndicies);
                this.setState({
                  squares: squares, 
                  selectedIndex: -1
                });
              }
            }
            else {
              console.log("invalid move");
              this.setState({
                squares: squares, 
                selectedIndex: -1
              });
            }
          }      
        }
    }
    render() {
        return (
          <div className="Game">
            {
              this.state.start ? 
              <div>
              <div>{this.state.player2}</div>
              <Board 
              squares={this.state.squares}
              onClick={(index) => this.handleClick(index)}
              />
              <div>{this.state.player1}</div>
              </div>
              :
              <div>
                <div>
                Welcome to online chess! Send this link with a friend to start your chess game
                </div>
                
                <div>
                    <input type="text" value={window.location} disabled />
                </div>

                <div>
                    <p>Waiting for game to start ...</p>
                </div>
              </div>
            }

          </div>
        );
    }
}