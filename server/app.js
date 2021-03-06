var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/view', (req, res) => {
    res.sendFile('display.html', { root: __dirname });
})

io.on('connection', (socket)=> {
    socket.on('join-message', (roomID) => {
        socket.join(roomID);
        console.log("User joined in room" + roomID);
    })

    socket.on('screen-data', function (data) {
        data = JSON.parse(data);

        var room = data.roomId;
        var img  = data.img;

        socket.broadcast.to(room).emit('screen-data', img);
    })
})

var server_port = process.env.YOUR_PORT || process.env.PORT || 5000;
http.listen(server_port, () => {
    console.log("Started on : "+ server_port);
})