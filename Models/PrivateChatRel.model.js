const mongoose=require('mongoose')

const ChatUserRel=mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    groupId:{
        type:String,
        ref:'Chat',
        required:true
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    lastMessage:{
        type:String,
        required:[true,'Message Required']
    },
    timestamp:{
        type:Date,
        default:Date.now
    }
})

module.exports=mongoose.model('ChatUserRel',ChatUserRel)