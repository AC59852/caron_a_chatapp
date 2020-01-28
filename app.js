var express = require('express');
var app = express();

const io = require('socket.io')();
const port = process.env.PORT || 3030;

// tell express where our static files are (js, images, css etc)
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

const server = app.listen(port, () => {
    console.log(`app is running on port ${port}`);
});

// this is all of the socket io functionality
io.attach(server);

io.on('connection', function(socket){
    console.log('a user connected');
    socket.emit('connected', { sID: `${socket.id}`, message: 'new connection'});

    // listen for a disconnect event
    socket.on('disconnect', function() {
        console.log("a user disconnected")
        
        message = `${socket.id} has left the chat.`;
        io.emit('user_disconnect', message);
    });

  });