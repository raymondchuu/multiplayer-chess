import React, { useState, useEffect } from 'react';
import Game from './Game';
import { useParams } from 'react-router-dom';
import { socket } from '../socket/socket';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import '../styles/Lobby.css';

export default function Lobby(props) {
    const [redirect, setRedirect] = useState(false);
    const gameId = useParams().gameId;

    useEffect(() => {
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
            <div className="lobby-container">
                <p>Enter your name to start the game!</p>
                <TextField id="outlined-basic" style={{marginBottom: '1%', width: '15vw'}} label="Name" variant="outlined" onChange={(event) => {props.setUsername(event.target.value)}} required />
                <Button variant="contained" color="primary" onClick={() => newPlayerJoin()}>
                    Enter
                </Button>
            </div>
        }
        </div>

    )
}