const express=require('express')
const app=express()
app.use(express.json())

const PrivateMessage=require('../Models/PrivateChat.model')
const User=require('../Models/User.model')
const ChatUserRel=require('../Models/PrivateChatRel.model')

const savePrivateMessage=async(msg)=>{
    try{
       console.log(msg)
       const newMessage = new PrivateMessage({
        ...msg,
        status: 'sent'
    });

    const existGroupId = await ChatUserRel.findOne({ groupId: msg.groupId }); // Use findOne()

    if (!existGroupId) {
      const newGroupId = new ChatUserRel({
        senderId: msg.senderId,
        receiverId: msg.receiverId,
        groupId: msg.groupId,
        lastMessage: msg.content,
        receiverUsername: msg.receiver
      });
      await newGroupId.save();
    } else {
      await existGroupId.updateOne({ $set: { lastMessage: msg.content } }); // Now existGroupId is a document
    }
    
    const savedMessage = await newMessage.save();
    console.log(savedMessage)
    return savedMessage;
     
    
    }catch(error){
      console.log(error)
      return error
    }
 }

 const fetchAllUserMessages = async (req, res) => {
  try {
    console.log(req.user);
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      throw new Error("Invalid user");
    }

    let chatList = await ChatUserRel.find({ $or: [{ senderId: userId }, { receiverId: userId }] });
    let messages = [];

    // Await the Promise.all() result
    chatList = await Promise.all(chatList.map(async (item) => {
      let msgs = await PrivateMessage.find({ groupId: item.groupId });
      console.log(msgs)
      msgs = msgs.map(msg => ({ ...msg._doc, id: msg._id }));
      
      // Collect messages properly
      messages.push(...msgs);

      return {
        chatId: item.id,
        type: item.senderId.toString() === userId.toString() || item.receiverId.toString() === userId.toString() ? 'direct' : 'group',
        participants: [userId.toString(), item.receiverId.toString()],
        lastMessage: item.lastMessage,
        receiverUsername: item.receiver,
        receiverId: item.receiverId.toString(),
        avatar: null,
        timestamp: item.timestamp
      };
    }));

    console.log(chatList, messages);

    res.status(200).json({ chatList, messages });

  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

module.exports={savePrivateMessage,fetchAllUserMessages}
 
