// imports always go first - if we're importing anything

const socket = io();

function setUserId(packet) {
    console.log(packet);
}

function runDisconnectMsg(packet) {
    console.log(packet)
}

// some event handling -> these events are coming from the server
socket.addEventListener('connected', setUserId);

socket.addEventListener('user_disconnect', runDisconnectMsg);