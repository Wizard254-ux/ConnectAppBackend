const mongoose=require('mongoose')

const UserSchema=mongoose.Schema({
    username:{
        type:String,
        require:[true,'Please enter your username'],
        unique:true
    },
    password:{
        type:String,
        required:[true,"Please enter a password"],
        minlength:[8,"Password must be at least 8 characters long"]
    },
    role:{
        type:String,
        required:[true,"Please enter a password"],
        enum:['normal','clubAdmin','superUser'],
        default:'normal'
    },
    email:{
        type:String,
        required:[true,"Please enter your email"],
        unique:true,
        validate:{
            validator:function(v){
                return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(v);
            },
            message:"Please enter a valid email address"
        }
    },
    isActive:{
        type:Boolean,
        default:true
    },
})

const User=mongoose.model("User",UserSchema)
module.exports=User