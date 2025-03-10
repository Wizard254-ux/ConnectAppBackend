express=require('express')
app=express()
http=require('http')
server=http.createServer(app)
socketIO=require('socket.io')
const {savePrivateMessage}=require('./Controllers/PrivateChat')
io=socketIO(server,{
    
        cors: {
            origin:['http://localhost:5173',],
            credentials:true
        }

})

io.on('connection',(socket)=>{
    console.log('Web Scoket connected')
    socket.on('disconnect',()=>{
        console.log('Web Scoket disconnected')
    })
    socket.on('join',(roomId)=>{
        console.log('User Joined Room:',roomId)
        socket.join(roomId)
    })
    socket.on('sendMessage',async(msg,callback)=>{
        console.log('User sent message:',msg)
        console.log('User sent message:', msg);

        try {
            // Save the message using the controller
            const savedMessage = await savePrivateMessage(msg);
            
            // Emit the message to the appropriate room
            io.to(msg.groupId).emit('message', savedMessage);

            // Acknowledge successful message save
            if (callback) callback({ success: true, message: savedMessage });
        } catch (error) {
            console.error('Error saving message:', error);

            // Send error acknowledgment
            if (callback) callback({ success: false, error: 'Failed to send message' });
        }
    })
    socket.on('deleteMessage',(msgId,room)=>{
        console.log('User deleted message:',msgId)
        io.to(room).emit('deleteMessage',msgId)
    })
    socket.on('message',(msg)=>{
        console.log('message received ',msg)
    })
})

module.exports={server,express,app,io}
