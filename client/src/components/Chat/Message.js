import React from 'react';

import '../../styles/Chat.css'

export default function Message({ message: { user, text }, name }) {
    var sentByUser = false;

    if (user === name) {
        sentByUser = true;
    }

    return (
        sentByUser ? 
            (
                <div className="messageContainer justifyEnd">
                    <p className="sentText pr-10">{name}</p>
                    <div className="messageBox backgroundBlue">
                        <p className="messageText colorWhite">{text}</p>
                    </div>
                </div>
            ) :
            (
                <div className="messageContainer justifyStart">
                    <p className="sentText pl-10">{user}</p>
                    <div className="messageBox backgroundLight">
                        <p className="messageText colorDark">{text}</p>
                    </div>
                </div>
            )
    )
}