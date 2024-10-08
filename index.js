const express=require('express');
const app=express();
 const connect=require('./config/db-config')

const http=require('http')
const server = http.createServer(app);

const {Server} = require('socket.io');
const io = new Server(server);

app.use('/',express.static(__dirname+'/public'));

io.on('connection', (socket) => {
    console.log(`a user connected ${socket.id}`);
    socket.on('disconnect', () => {
        console.log(`user disconnected ${socket.id}`);
      });


    
    socket.on('chat message', (msg) => {
          console.log('message: ' + msg);

          io.emit('chat message',socket.id+'--'+msg)
        })

   
  });

server.listen(3000,async()=>{
    console.log('listening on port 3000');
    await connect();
    console.log('DB connected')
})
