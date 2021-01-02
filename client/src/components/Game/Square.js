import React from 'react';
import '../../styles/board.css';

export default function Square(props) {
    return (
        <button 
            onClick={props.onClick}
            className={"square " + props.colour}
            style={props.style}
        ></button>
    )
}