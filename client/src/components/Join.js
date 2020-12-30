import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import {socket} from '../socket/socket';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import '../styles/Join.css';

export default function Join(props) {
    const [redirect, setRedirect] = useState(false);
    const [gameId] = useState(uuidv4());

    const generateGameId = () => {
        setRedirect(true);
        socket.emit('joinGameLobby', {gameId, username: props.username});
    };

    return (
        <div>
            {redirect ?
                <Redirect to={"/game/" + gameId} />
                :
                <div class="home-container">
                    <h1>Play Chess Online</h1>
                    <p>Enter your name to create your game lobby!</p>
                    <TextField id="outlined-basic" style={{width: '15vw', marginBottom: '1%'}} label="Name" variant="outlined" onChange={(event) => {props.setUsername(event.target.value)}} required />
                    <Link onClick={(event) => { props.username === 0 ? event.preventDefault() : generateGameId()}} >
                        <Button variant="contained" color="primary">
                            Enter
                        </Button>
                    </Link>
                </div>
            
            }
        </div>
    )
}