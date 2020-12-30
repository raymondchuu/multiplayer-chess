const express = require('express');
const http = require('http');
const Socketio = require('socket.io');

const HTTP_PORT = process.env.PORT || 4000;

const app = express();
const server = http.createServer(app);
const io = Socketio(server);
var numClients = {};
var clientNames = {};


io.on('connection', (socket) => {
    console.log("a user connected");

    socket.on('disconnect', () => {
        console.log("a user disconnected"); 
        numClients[socket.room]--;
        console.log(numClients[socket.room]);
    })


    socket.on('joinGameLobby', (room) => {
        const gameId = room.gameId;

        socket.join(gameId);
        console.log(gameId);
        socket.room = gameId;

        if (numClients[gameId] === undefined) {
            numClients[gameId] = 1;
        }
        else {
            numClients[gameId]++;
        }

        if (clientNames[gameId] === undefined) {
            clientNames[gameId] = [];
        }
        
        clientNames[gameId].push(room.username)
        
        console.log(clientNames[gameId]);

    })

    socket.on("shouldGameStart", (gameId) => {
        console.log(numClients[gameId]);
        if (numClients[gameId] === 2) {
            io.in(gameId).emit("start game", clientNames[gameId]);
            io.in(gameId).emit('message', { text: "Welcome to Online Chess!", user: "admin" });
        }

        if (numClients[gameId] > 2) {
            console.log("room full :(");
        }
    })

    socket.on('move', (state) => {
        io.in(state.gameId).emit('userMove', state); 
    })

    socket.on("sendMessage", (message, gameId, username, callback) => {
        io.in(gameId).emit('message', { text: message, user: username })
        callback();
    })
})

server.listen(4000, () => {
    console.log(`listening on port ${HTTP_PORT}`);
})