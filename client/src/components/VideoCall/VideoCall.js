import React, { useRef, useState, useEffect } from 'react';
import { socket } from '../../socket/socket';
import Peer from 'simple-peer';
import Button from '@material-ui/core/Button';

export default function VideoCall(props) {
    const [callAccepted, setCallAccepted] = useState(false);
    const [stream, setStream] = useState();
    const [receivingCall, setReceivingCall] = useState(false);
    const [caller, setCaller] = useState("");
    const [callerSignal, setCallerSignal] = useState();

    const userVideo = useRef();
    const partnerVideo = useRef();

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((stream) => {
            setStream(stream);
            if (userVideo.current) {
                userVideo.current.srcObject = stream;
            }
        })

        socket.on("hello", (data) => {
            setReceivingCall(true);
            setCaller(data.from);
            setCallerSignal(data.signal);
        })
    }, []);

    function callPeer(username) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: stream,
        });

        peer.on("signal", data => {
            socket.emit("callUser", { userToCall: username, signalData: data, from: props.username, gameId: props.gameId })
        });

        peer.on("stream", stream => {
            if (partnerVideo.current) {
                partnerVideo.current.srcObject = stream;
            }
        });

        socket.on("callAccepted", signal => {
            setCallAccepted(true);
            peer.signal(signal);
        });
    }

    function acceptCall() {
        setCallAccepted(true);
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: stream,
        });

        peer.on("signal", data => {
            socket.emit("acceptCall", { signal: data, to: caller, gameId: props.gameId});
        });

        peer.on("stream", stream => {
            partnerVideo.current.srcObject = stream;
        });

        peer.signal(callerSignal); 
        setReceivingCall(false);
    }

    var UserVideo;
    if (stream) {
        UserVideo = (
            <video playsInline ref={userVideo} muted autoPlay style={{width: '20vw'}} />
        );
    }

    var PartnerVideo;
    if (callAccepted) {
      PartnerVideo = (
        <video playsInline ref={partnerVideo} autoPlay style={{width: '20vw'}}/>
      );
    }
  
    var incomingCall;
    if (receivingCall && props.username !== caller) {
      incomingCall = (
        <div>
          <h1>{caller} is calling you</h1>
          <Button variant="contained" color="primary" onClick={acceptCall}>
                Accept
            </Button>
        </div>
      )
    }

    return(
        <div>
            <div>
                {UserVideo}
                {PartnerVideo}
            </div>
            <div>
                {props.allUsers.map(name => {
                    if (name !== props.username && !callerSignal) {
                        return <Button variant="contained" color="primary" onClick={() => callPeer(name)}>Call {name}</Button>
                    }
                })}
            </div>
            <div>
                {incomingCall}
            </div>
        </div>
    );
}