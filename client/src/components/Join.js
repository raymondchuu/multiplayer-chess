import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import {socket} from '../socket/socket';

export default function Join(props) {
    const [redirect, setRedirect] = useState(false);
    const [gameId] = useState(uuidv4());

    const generateGameId = () => {
        setRedirect(true);
        console.log(gameId);
        socket.emit('joinGameLobby', {gameId, username: props.username});
    };

    return (
        <div>
            {redirect ?
                <Redirect to={"/game/" + gameId} />
                :
                <div>
                    <h1>Welcome to online chess!</h1>
                    <label>Name: </label>
                    <input type="text" name="name" className="join-input" onChange={(event) => {props.setUsername(event.target.value)}} required /> <br/>
                    <Link onClick={(event) => { props.username === 0 ? event.preventDefault() : generateGameId()}} >
                        <button>Enter!</button>
                    </Link>
                </div>
            
            }

        </div>
    )
}