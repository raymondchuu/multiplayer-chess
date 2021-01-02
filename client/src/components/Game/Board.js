import React from 'react';
import Square from './Square';

import '../../styles/board.css';

export default class Board extends React.Component {
    renderSquare(i, colour) {
        return <Square 
                onClick={() => this.props.onClick(i)}
                style={this.props.squares[i] ? this.props.squares[i].style : null}
                piece={this.props.squares[i]}
                colour={colour}
                />
    }

    render() {
        var board = [];
        
        if (this.props.player === 1) {
            for (var i = 0; i < 8; ++i) {
                var row = [];
                for (var j = 0; j < 8; ++j) {
                    if (i % 2 === 0) {
                        if (j % 2 === 0) {
                            row.push(this.renderSquare(i * 8 + j, "light"));
                        }
                        else {
                            row.push(this.renderSquare(i * 8 + j, "dark"));
                        }
                    }
    
                    else {
                        if (j % 2 === 0) {
                            row.push(this.renderSquare(i * 8 + j, "dark"));
                        }
                        else {
                            row.push(this.renderSquare(i * 8 + j, "light"));
                        }
                    }
                }
                board.push(<div>{row}</div>);
            }
        }

        else {
            for (var i = 7; i >= 0; --i) {
                var row = [];
                for (var j = 7; j >= 0; --j) {
                    if (i % 2 === 0) {
                        if (j % 2 === 0) {
                            row.push(this.renderSquare(i * 8 + j, "light"));
                        }
                        else {
                            row.push(this.renderSquare(i * 8 + j, "dark"));
                        }
                    }
    
                    else {
                        if (j % 2 === 0) {
                            row.push(this.renderSquare(i * 8 + j, "dark"));
                        }
                        else {
                            row.push(this.renderSquare(i * 8 + j, "light"));
                        }
                    }
                }
                board.push(<div>{row}</div>);
            }
        }


        return (
            <div className="board-container">
                { board }
            </div>
        )
    }
}