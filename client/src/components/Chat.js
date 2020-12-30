import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { socket } from '../socket/socket';
import ScrollToBottom from 'react-scroll-to-bottom';
import Message from './Message';

import '../styles/Chat.css';

export default function Chat(props) {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    

    useEffect(() => {
        socket.on('message', (receivedMessage) => {
            setMessages([...messages, receivedMessage]);
        });

        return () => {
            socket.off('message');
        }

    }, [messages]);

    //sending messages

    const sendMessage = (event) => {
        event.preventDefault();

        if (message) {
            socket.emit("sendMessage", message, props.gameId, props.username, () => setMessage("")); 
        }

    }

    return (
            <div className="chat-container">
                <div>
                    <ScrollToBottom className="messages">
                        {messages.map((message, i) => (<div key={i}><Message message={message} name={props.username}/></div>))}
                    </ScrollToBottom>
                </div>
                <form>

                <div className="input-container">
                    <TextField 
                        id="standard-basic" 
                        className="input"
                        label="Write a Message!" 
                        value={message} 
                        onChange={(event) => setMessage(event.target.value)} 
                        onKeyPress={event => event.key === 'Enter' ? sendMessage(event) : null}
                    />
                    <Button variant="contained" className="send-btn" color="primary" onClick={(event) => sendMessage(event)}>
                        Send
                    </Button>
                </div>
                </form>
            </div>
    )
}