import React, { useState, useEffect } from 'react';
import Board from './Board';
import Chat from './Chat';
import initializeChessBoard from '../helpers/InitializeChessBoard';
import Rook from '../pieces/Rook';
import Queen from '../pieces/Queen';
import { socket } from '../socket/socket';
import TextField from '@material-ui/core/TextField';

import '../styles/Game.css';


export default function Game(props) {
  const [squares, setSquares] = useState(initializeChessBoard(1));
    const [playerTurn, setPlayerTurn] = useState(1);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [usernames, setUsernames] = useState([]);
    //const [validMove, setValidMove] = useState(false);
    const [start, setStart] = useState(false);
    const [playerOne, setPlayerOne] = useState(false);

    useEffect(() => {
      socket.on('userMove', (state) => {
          var temp = squares.slice();
          temp[state.endIndex] = temp[state.initialIndex];
          temp[state.initialIndex] = null;
  
          setSquares(temp);
          setPlayerTurn(playerTurn === 1 ? 2 : 1);
          setSelectedIndex(-1);
    //      setValidMove(false);
          console.log("new socket on");

      })
    });

     useEffect(() => {
      socket.emit("shouldGameStart", props.gameId);

      socket.on("start game", (users) => {
        setStart(true);
        setUsernames(users);
      });
    }, []); 

    function handleEnPassant(squares, index) {
        if (playerTurn === 1) {
          //left en passant
          if (index === selectedIndex - 9) {
            squares[index] = squares[selectedIndex];
            squares[selectedIndex] = null;
            squares[index + 8] = null;
          }
        
          //right en passant
          if (index === selectedIndex - 7) {
            squares[index] = squares[selectedIndex];
            squares[selectedIndex] = null;
            squares[index + 8] = null;
          }
        }
    
        else {
          //left en passant
          if (index === selectedIndex + 7) {
            squares[index] = squares[selectedIndex];
            squares[selectedIndex] = null;
            squares[index - 8] = null;
          }
    
          //right en passant
          if (index === selectedIndex + 9) {
            squares[index] = squares[selectedIndex];
            squares[selectedIndex] = null;
            squares[index - 8] = null;
          }
        }
    
        return squares;
    }
    
    function checkEnPassant(squares, index) {
        const enPassantPositions = {
          1: [24, 25, 26, 27, 28, 29, 30, 31],
          2: [32, 33, 34, 35, 36, 37, 38, 39]
        }
        const otherPlayer = playerTurn === 1 ? 2 : 1;
    
        if (squares[selectedIndex].name === "Pawn" && enPassantPositions[1].indexOf(selectedIndex) >= 0 && playerTurn === 1) {
          //left en passant
          console.log("first check");
          console.log(squares[selectedIndex - 9] === index);
          if (squares[selectedIndex - 1] !== null && squares[selectedIndex - 1].name === "Pawn" && squares[selectedIndex - 1].player === otherPlayer && squares[selectedIndex - 1].doubleJump && index === selectedIndex - 9) {
            console.log("second check");
            return true;
          }
          if (squares[selectedIndex + 1] !== null && squares[selectedIndex + 1].name === "Pawn" && squares[selectedIndex + 1].player === otherPlayer && squares[selectedIndex + 1].doubleJump && index === selectedIndex - 7) {
            return true;
          }
        }
    
        if (squares[selectedIndex].name === "Pawn" && enPassantPositions[2].indexOf(selectedIndex) >= 0 && playerTurn === 2) {
          if (squares[selectedIndex - 1] !== null && squares[selectedIndex - 1].name === "Pawn" && squares[selectedIndex - 1].player === otherPlayer && squares[selectedIndex - 1].doubleJump && index === selectedIndex + 7) {
            return true;
          }      
          if (squares[selectedIndex - 1] !== null && squares[selectedIndex - 1].name === "Pawn" && squares[selectedIndex - 1].player === otherPlayer && squares[selectedIndex - 1].doubleJump && index === selectedIndex + 9) {
            return true;
          }
        }
    
        return false;
    }
    
    function isMyKinginCheck(squares) {
        return new Promise((resolve, reject) => {
    
        var kingIndex = -1;
        var check = false;
        var otherPlayer = playerTurn === 1 ? 2 : 1;
        //locate your king
        for (var i = 0; i < squares.length && kingIndex < 0; ++i) {
          if (squares[i] !== null && squares[i].name === "King" && squares[i].player === playerTurn) {
            kingIndex = i;
          }
        }
        
        var found = false;
        console.log(kingIndex);
    
        //check if king is in check
        for (var j = 0; j < squares.length && !found; ++j) {
          if (squares[j] !== null && squares[j].player === otherPlayer) {
            const validMove = squares[j].isMoveValid(j, kingIndex, true);
            const path = squares[j].getPathIndicies(j, kingIndex);
            if (validMove) {
              const validPath = checkValidPath(squares, path);
              if (validPath) {
                found = true;
              }
            }
          }
        }
    
        if (found) {
          squares[kingIndex].style = {...squares[kingIndex].style, backgroundColor: 'red'};
          check = true;
        }
        else {
          squares[kingIndex].style = {...squares[kingIndex].style, backgroundColor: null};
          check = false;
        }
        const obj = { check, kingIndex };
        resolve(obj);
      })
    }
    
    function checkValidPath(squares, path) {
        var valid = true;
        
        for (var i = 0; i < path.length && valid; ++i) {
          if (squares[path[i]] !== null) {
            valid = false;
          }
        }
    
        return valid;
    }
    
    function checkRook(squares, index) {
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
    
    function checkCastle(squares, index) {
        if (selectedIndex === 4 || selectedIndex === 60) {
          if (!squares[63].moved() || !squares[56].moved() || !squares[0].moved() || !squares[7].moved()) {
            //short castle
            if (index === 62) {
              if (checkRook(squares, index)) {
                if (squares[61] === null && squares[62] === null) {
                  squares[index] = squares[selectedIndex];
                  squares[index].handleMoved();
                  squares[selectedIndex] = null;
                  squares[61] = new Rook(1);
                  squares[63] = null;
                }
    
                else {
                  return false;
                }
              }
            }
    
            if (index === 6) {
              if (checkRook(squares, index)) {
                if (squares[5] === null && squares[6] === null) {
                  squares[index] = squares[selectedIndex];
                  squares[index].handleMoved();
                  squares[selectedIndex] = null;
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
              if (checkRook(squares, index)) {
                if (squares[1] === null && squares[2] === null && squares[3] === null) {
                  squares[index] = squares[selectedIndex];
                  squares[index].handleMoved();
                  squares[selectedIndex] = null;
                  squares[3] = new Rook(2);
                  squares[0] = null;
                }
                else {
                  return false;
                }
              }
            }
    
            if (index === 58) {
              if (checkRook(squares, index)) {
                if (squares[57] === null && squares[58] === null && squares[59] === null) {
                  squares[index] = squares[selectedIndex];
                  squares[index].handleMoved();
                  squares[selectedIndex] = null;
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
    
    
    function handleClick(index) {
      var player = usernames[0] === props.username ? 1 : 2;
      console.log(player);
      console.log(playerTurn);
      if (player === playerTurn) {
        //shallow copy squares 
        const tempsquares = squares.slice();
    
        console.log(index);
        //highlight chess piece
        if (selectedIndex < 0) {
          if (tempsquares[index] && (tempsquares[index].player === playerTurn)) {
            tempsquares[index].style = {...tempsquares[index].style, backgroundColor: "#575E6B" };
            setSquares(tempsquares);
            setSelectedIndex(index);
            socket.off('userMove');
          }
          else {
            console.log("That is not your piece");
          }
        }
    
        //piece has been selected
        else {
          tempsquares[selectedIndex].style = {...squares[selectedIndex].style, backgroundColor: null};
    
          // castling king and rook
          if (tempsquares[selectedIndex] !== null && tempsquares[selectedIndex].name === "King" && !tempsquares[selectedIndex].moved() && (index === 2 || index === 6 || index === 58 || index === 62)) {
            const newSquares = checkCastle(tempsquares, index);
            if (newSquares) {
              var nextTurn = playerTurn === 1 ? 2 : 1;
              setSquares(newSquares);
              setSelectedIndex(-1);
              setPlayerTurn(nextTurn);
            }
            else {
              console.log("invalid move");
              setSelectedIndex(-1);
            }
          }
    
          //en passant
          else if (checkEnPassant(tempsquares, index)) {
            const newSquares = handleEnPassant(tempsquares, index);
            var nextTurn = playerTurn === 1 ? 2 : 1;
            setSquares(newSquares);
            setSelectedIndex(-1);
            setPlayerTurn(nextTurn);
          }
    
          //if destination of piece is clicked on own piece
          else if (tempsquares[index] !== null && tempsquares[index].player === playerTurn) {
            console.log("That's your own piece wtf");
            setSquares(tempsquares);
            setSelectedIndex(-1);
          }
    
          // if destination is not on own piece
          else {
            console.log(tempsquares[selectedIndex]);
            const lastRows = {
              1: [0, 1, 2, 3, 4, 5, 6, 7],
              2: [56, 57, 58, 59, 60, 61, 62, 63]
            };
            const isSquareOccupied = tempsquares[index] === null ? false : true;
            const validMove = tempsquares[selectedIndex].isMoveValid(selectedIndex, index, isSquareOccupied);
            const pathIndicies = tempsquares[selectedIndex].getPathIndicies(selectedIndex, index);
            if (validMove) {
              const validPath = checkValidPath(tempsquares, pathIndicies);
              if (validPath) {
                tempsquares[index] = tempsquares[selectedIndex];
                tempsquares[index].handleMoved();
                tempsquares[selectedIndex] = null;
                console.log(tempsquares[index]);
    
                // pawn to queen
                if (tempsquares[index].name === "Pawn" && lastRows[1].indexOf(index) >= 0) {
                  tempsquares[index] = null;
                  tempsquares[index] = new Queen(1);
                }
                if (tempsquares[index].name === "Pawn" && lastRows[2].indexOf(index) >= 0) {
                  tempsquares[index] = null;
                  tempsquares[index] = new Queen(2);
                }
    
                // check if king is in check with shallow copied board
                isMyKinginCheck(tempsquares)
                .then((data) =>{
                  console.log(data.check);
                  if (data.check) {
                    console.log("Move your king white!");
                    setSelectedIndex(-1);
                  }
                  else {
                    console.log(index);
//                    setValidMove(true);

                    socket.emit('move', {
                    initialIndex: selectedIndex,
                    endIndex: index,
                    gameId: props.gameId,
                    }) 

                  }
                }) 
                .catch((err) => {
                  console.log(err);
                })        
              }
              else {
                console.log("invalid path", pathIndicies);
                setSquares(tempsquares);
                setSelectedIndex(-1);
              }
            }
            else {
              console.log("invalid move");
              setSquares(tempsquares);
              setSelectedIndex(-1);
            }
          }      
        }
      }

      else {
        console.log("not your turn");
      }
    }

      return (
        <div className="Game">
          {
            start ? 
            <div className="game-container">
              <div>
                <h1>{usernames[0] === props.username ? usernames[1] : usernames[0]}</h1>
                <Board 
                squares={squares}
                onClick={(index) => handleClick(index)}
                player={usernames[0] === props.username ? 1 : 2}
                />
                <h1>{usernames[0] === props.username ? usernames[0] : usernames[1]}</h1>
              </div>
              <div>
                  <Chat username={props.username} gameId={props.gameId} />
              </div>
            </div>
            :
            <div className="game-lobby-container">
              <h1>Welcome to Online Chess!</h1>
              <p>
                Hey {props.username}! This app was made so that you can play chess with your friends at the comfort of your own home!
              </p>
              <p>
                Send this link with a friend to start your chess game
              </p>
              
              <div>
              <TextField
                id="outlined-read-only-input"
                label="Share Link"
                defaultValue={window.location}
                InputProps={{
                  readOnly: true,
                }}
                style={{width: '30vw', marginTop: '2%', marginBottom: '1%'}}
                variant="outlined"
              />                  
              </div>

              <div>
                  <p>Waiting for game to start ...</p>
              </div>
            </div>
          }

        </div>
      );
    }
