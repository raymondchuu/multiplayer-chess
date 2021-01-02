import io from 'socket.io-client';

//const CONNECTION = "https://chess-online-backend.herokuapp.com/";
const CONNECTION = "http://localhost:4000/";

const socket = io(CONNECTION, {
    transports: ["websocket", "polling"]
});

export { socket };