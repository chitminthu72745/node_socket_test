const { Socket } = require('dgram');

require('dotenv').config();
let express = require('express'),
    app = express(),
    path = require('path'),
    hogan = require('hogan-express'),
    server = require('http').createServer(app),
    io = require('socket.io')(server);

    //Hogan Tamplate Engine Use
    app.engine('html',hogan);
    app.set('view engine', 'html');
    app.use(express.static(path.join(__dirname, 'assets')));

// Socket Run
let userMap = new Map();
let room1 = 'public';
let room2 = 'private';
io.sockets.on('connection', socket => {
    socket.on('login', data => {
        socket.username = data;
        userMap.set(socket.username, socket.id);
        if(data == 'w' || data == 'x'){
            socket.join(room1);
            socket.userroom = room1;
        }else{
            socket.join(room2);
            socket.userroom = room2;
        }
        socket.emit('login-success',true);
    });
    socket.on('msg', data=>{
        io.in(socket.userroom).emit('send-data', socket.username + ":" + data);
    })
});

// Route
app.get('/',(req,res)=>{
    res.render('index');
});


// Listen Server Running
server.listen(process.env.PORT, ()=> {
    console.log(`Server is running on Port ${process.env.PORT}`);
})