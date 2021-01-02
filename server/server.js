const express = require('express');
const http = require('http');
const Socketio = require('socket.io');

const HTTP_PORT = process.env.PORT || 4000;

const app = express();
const server = http.createServer(app);
const io = Socketio(server);
var numClients = {};
var clientNames = {};
var rematchCounter = 0;


io.on('connection', (socket) => {
    console.log("a user connected");

    socket.on('disconnect', () => {
        console.log("a user disconnected"); 
        numClients[socket.room]--;
        console.log(numClients[socket.room]);
    });


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

    });

    socket.on("shouldGameStart", (gameId) => {
        console.log(numClients[gameId]);
        if (numClients[gameId] === 2) {
            io.in(gameId).emit("start game", clientNames[gameId]);
            io.in(gameId).emit('message', { text: "Welcome to Online Chess!", user: "admin" });
        }

        if (numClients[gameId] > 2) {
            console.log("room full :(");
        }
    });

    socket.on('move', (state) => {
        io.in(state.gameId).emit('userMove', state); 
    });

    socket.on('castle', (data) => {
        io.in(data.gameId).emit('castleBoard', data);
    });

    socket.on("rematch", (data) => {
        rematchCounter += data.num;
        console.log("rematch counter " + rematchCounter);
        if (rematchCounter === 2) {
            rematchCounter = 0;
            io.in(data.gameId).emit("initiateRematch")
        }
    });

    socket.on("clickResign", (data) => {
        console.log("user clicked resign");
        io.in(data.gameId).emit("initiateResign");
    });

    socket.on("enPassant", (data) => {
        io.in(data.gameId).emit("handleEnpassant", data);
    })

    //messaging chat
    socket.on("sendMessage", (message, gameId, username, callback) => {
        io.in(gameId).emit('message', { text: message, user: username })
        callback();
    });

    //video chat
    socket.on("callUser", (data) => {
        io.in(data.gameId).emit("hello", { signal: data.signalData, from: data.from })
    });

    socket.on('acceptCall', (data) => {
        io.in(data.gameId).emit("callAccepted", data.signal);
    });
})

server.listen(HTTP_PORT, () => {
    console.log(`listening on port ${HTTP_PORT}`);
})