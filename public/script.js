console.log("Welcome to sockets")
const socket=io();

const input=document.getElementById('input');
const button=document.getElementById('button');
const list=document.getElementById('list')

button.addEventListener('click',()=>{
    if (input.value) {
        socket.emit('chat message', input.value);
        input.value = '';
      }
})


socket.on('chat message',(msg)=>{
   const item=document.createElement('li');
   item.textContent=msg;
   list.appendChild(item);
}

)