const express=require('express')
const mongoose=require('mongoose')
const path=require('path')
const fs=require('fs')
const app=express()
app.use(express.json())
const UserProfile=require('../Models/Profile.model')
const User=require('../Models/User.model')


const createProfile=async(req,res)=>{
    try{
        const userId = req.user.id;
        console.log(req.files)
        const existingProfile = await UserProfile.findOne({ userId: userId });
        if (existingProfile) {
          return res.status(400).json({ error: 'Profile already exists for this user' });
        }
       console.log(req.body)
        req.files.map(file=>{
            console.log(file.path)
        })


        const profileData = {
          userId: userId, // Use the converted ObjectId
            ...req.body,
            images: req.files.map(file => path.basename(file.path)) // Store file paths in database
          };  
          const profile = await UserProfile.create(profileData)
          const data={
            ...profile._doc,
            images:profile.images.map(imageName=>{
              return `https://connectappbackend-9q1i.onrender.com/api/userProfile/handleProfilePics${imageName}`
                    })}
      res.status(201).json({message:"succesfull",data})
    }catch(error){
      res.status(500).json({message:error.message})
    }
 }
const getProfile=async(req,res)=>{
    try{
        const userId = req.user.id;
        const existingProfile = await UserProfile.findOne({ userId: userId });
        if (!existingProfile) {
          return res.status(404).json({ error: 'Profile does not exists for this user' });
        }
        console.log(existingProfile)
    

        const profile={
            ...existingProfile._doc,
            images:existingProfile.images.map(imageName=>{
              return `https://connectappbackend-9q1i.onrender.com/api/userProfile/handleProfilePics/${imageName}`         
          })
          }
        


        // const profileData = {
        //   user: userId, // Use the converted ObjectId
        //     ...req.body,
        //     interests: JSON.parse(req.body.interests),
        //     images: req.files.map(file => file.path) // Store file paths in database
        //   };  
        //   const profile = await UserProfile.create(profileData)
      res.status(201).json({message:"succesfull",data:profile})
     
    
    }catch(error){
      res.status(500).json({message:error.message})
    }
 }
const deleteImage=async(req,res)=>{
    try{
        const userId = req.user.id;
        const imgName=req.query.imageName;
        if(!imgName){
          return res.status(400).send({message:'you must provide image name'})
        }
          const existingProfile = await UserProfile.findOne({ userId: userId });
          if (!existingProfile) {
            return res.status(404).json({ error: 'Profile does not exists for this user' });
          }
          const fullPath=path.join(__dirname,'../Middleware/UserImages',imgName)
          if(fs.existsSync(fullPath)){
            fs.unlinkSync(fullPath)
            console.log("Image deleted successfully")
          }
          const newImages=existingProfile.images.filter(imageName=>imageName!=imgName)
          await UserProfile.updateOne({ userId: userId }, { images: newImages })
           
      res.status(200).json({message:"succesfull",data:newImages})
     
    
    }catch(error){
      console.log(error.message)
      res.status(500).json({message:error.message})
    }
 }
 const updateProfile = async (req, res) => {
  try {
      const userId = req.user.id;
    
      const existingProfile = await UserProfile.findOne({ userId: userId });
      if (!existingProfile) {
          return res.status(404).json({ error: 'Profile does not exist for this user' });
      }

      let images = [...existingProfile.images];
      if (req.files && req.files.length > 0) {
          req.files.map(file => {
              images.push(path.basename(file.path));
          });
      }

      // Prepare the update object
      const updateFields = {
          images: images,
          ...req.body 
      };

      // Remove undefined fields
      for (let key in updateFields) {
          if (updateFields[key] === undefined) {
              delete updateFields[key];
          }
      }

      // Use findOneAndUpdate to get the updated document
      const updatedProfile = await UserProfile.findOneAndUpdate(
          { userId: userId },
          { $set: updateFields },
          { new: true } // Return the updated document
      );

      res.status(200).json({
          message: "Profile updated successfully",
          ...updatedProfile._doc
      });
  } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: error.message });
  }
};

const handleDp=async(req,res)=>{
  const username=req.params.username
  const existingUser=await User.findOne({username})
  const existingProfile=await UserProfile.findOne({userId:existingUser.id})
  if(existingProfile){
    res.sendFile(path.join(__dirname,'../Middleware/UserImages',existingProfile.images[0]))
  }else{
    res.status(404).json({message:'Profile not found'})
  }
}

const handleProfilePics=(req,res)=>{
  const picName=req.params.picName
  if(picName){
    res.sendFile(path.join(__dirname,'../Middleware/UserImages',picName))
  }else{
    res.status(404).json({message:' picture Not found'})
  }
}

 module.exports={
    createProfile,
    getProfile,
    deleteImage,
    updateProfile,
    handleDp,
    handleProfilePics
 }