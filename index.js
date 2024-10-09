const express=require('express');
const app=express();
 const connect=require('./config/db-config')
 const Group = require('./models/group');
const Chat = require('./models/chat');
app.use(express.json());
app.use(express.urlencoded({extended:true}))

const http=require('http')
const server = http.createServer(app);

const {Server} = require('socket.io');
const io = new Server(server);

app.use('/',express.static(__dirname+'/public'));
app.set('view engine', 'ejs');

app.get('/chat/:roomid/:user',async(req,res)=>{

  const group=await Group.findById(req.params.roomid);
  const chats=await Chat.find({
    roomid:req.params.roomid
  });
  console.log(chats);
  
 res.render('index',{
  roomid:req.params.roomid,
  user:req.params.user,
  groupname: group.name,
  previousmsgs:chats

 })


})


app.get('/group',async(req,res)=>{
      res.render('group')
})

app.post('/group',async(req,res)=>{
  console.log(req.body);
  await Group.create({
    name:req.body.name
  });
  res.redirect('/group')
})

io.on('connection', (socket) => {
    console.log(`a user connected ${socket.id}`);
    socket.on('disconnect', () => {
        console.log(`user disconnected ${socket.id}`);
      });

    socket.on('join room',(data)=>{
         console.log('joining the room',data.roomid);
         socket.join(data.roomid);
    })

    
    socket.on('chat message', async(data) => {
          console.log('message: ' + data);

          const chat=await Chat.create({
            roomid:data.roomid,
            sender:data.sender,
            content:data.message
          })

          io.to(data.roomid).emit('chat message',data)
        })

   
  });

server.listen(3000,async()=>{
    console.log('listening on port 3000');
    await connect();
    console.log('DB connected')
})
