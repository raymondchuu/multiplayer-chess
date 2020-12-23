import React, { useState } from 'react';

export default function Chat() {
    const [message, setMessage] = useState("");
    const [chatLog, setChatLog] = useState({});

    return (
        <div>
            <ul id="chat-log"></ul>
            <form>
                <input type="text"/>
                <button>Send</button>
            </form>
        </div>
    )
}