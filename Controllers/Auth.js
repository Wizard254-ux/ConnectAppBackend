const express=require('express')
const app=express()
const jwt=require('jsonwebtoken')
const User=require('../Models/User.model')
const Profile=require('../Models/Profile.model')
app.use(express.json())
const bcrypt=require('bcryptjs')

const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const existingProfile = await Profile.findOne({ userId: existingUser.id });
        let profile = existingProfile ? existingProfile._id.toString() : null;

        const accessToken = jwt.sign(
            { id: existingUser.id, role: existingUser.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );
        
        const refreshToken = jwt.sign(
            { id: existingUser.id, role: existingUser.role },
            process.env.JWT_SECRET_REFRESH,
            { expiresIn: '7d' }
        );

        res.status(200).json({
            username: existingUser.username,
            id: existingUser.id,
            role: existingUser.role,
            profile,
            access:accessToken,
            refresh:refreshToken
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
        return res.status(400).json({ message: 'Refresh token required' });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH);
        const user = await User.findById(decoded.id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const accessToken = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({ accessToken });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Refresh token expired' });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }
};
const createUser=async(req,res)=>{
    const {username,email,password}=req.body
    try{
        console.log(req.body,username)
        const existingUser=await User.findOne({username})
        const existingemail=await User.findOne({email})
        if(existingUser){
            return res.status(400).json({message:'User with username already exists'})
        }
        if(existingemail){
            return res.status(400).json({message:'User with email already exists'})
        }
    
     const hashedPassword= await bcrypt.hash(password,10)
     const newUser=new User({
         username,
         email,
         password:hashedPassword,
     })
     await newUser.save()

     const access=jwt.sign({id:newUser.id,role:newUser.role},process.env.JWT_SECRET,{expiresIn:'1d'})
     const refresh=jwt.sign({id:newUser.id,role:newUser.role},process.env.JWT_SECRET_REFRESH,{expiresIn:'7d'})
     
     res.status(201).json({
        username:newUser.username,
        id:newUser.id,
        role:newUser.role,
        profile:null,
        access,
        refresh
    })
    }catch(error){
      res.status(500).json({message:error.message})
    }
 
}


module.exports={
    loginUser,createUser,refreshToken
}