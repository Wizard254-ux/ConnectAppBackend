const mongoose=require('mongoose')
const ProfileSchema=mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    images:{
        type:[String]
    },
   
    interests:{
        type:String
    },
    hobbies:{
        type:String
    },
    age:{
        type:Number
    },
    description:{
        type:String
    }
})

const UserProfile=mongoose.model("UserProfile",ProfileSchema)
module.exports=UserProfile
