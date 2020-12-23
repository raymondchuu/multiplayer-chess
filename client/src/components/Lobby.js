import React, { useState, useEffect } from 'react';
import Game from './Game';
import { Redirect, useParams } from 'react-router-dom';
import { socket } from '../socket/socket';

export default function Lobby(props) {
    const [redirect, setRedirect] = useState(false);
    const gameId = useParams().gameId;
    const [roomNames, setRoomNames] = useState([]);

    useEffect(() => {
/*         socket.on("start game", (usernames) => {
            setRoomNames(usernames);
        }); */

        if (props.username) {
            setRedirect(true);
        }
        
    }, [])

    const newPlayerJoin = () => {
        setRedirect(true);
        socket.emit("joinGameLobby", {gameId, username: props.username});
    }
    return (
        <div>
        {
        redirect ? 
            <div>
                <Game username={props.username} gameId={gameId} />
            </div>
        :
            <div>
                <p>Enter username</p> <br/>
                <input type="text" onChange={(event) => {props.setUsername(event.target.value)}} /> <br/>
                <button onClick={() => newPlayerJoin()}>Enter</button>
            </div>
        }
        </div>

    )
}