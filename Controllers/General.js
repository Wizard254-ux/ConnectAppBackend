const express=require('express')
const mongoose=require('mongoose')
const path=require('path')
const fs=require('fs')
const app=express()
app.use(express.json())
const UserProfile=require('../Models/Profile.model')

const getAllProfile=async(req,res)=>{
    try{
       console.log(req.user)
        const userId = req.user.id;        
        const existingProfiles = await UserProfile.find().populate('userId','username _id role');
        if (!existingProfiles) {
          return res.status(200).json({message:"succesfull",profiles:[]});
        }
        console.log(existingProfiles)

        const data=existingProfiles.map(profile=>{
            return({
                ...profile._doc,
                images:profile.images.map(imageName=>{
                  return `http:/192.168.137.1:5000/api/userProfile/${imageName}`         
              })
            })
          })
        



      res.status(201).json(data)
     
    
    }catch(error){
      console.log(error)
      res.status(500).json({message:error.message})
    }
 }

 module.exports={
    getAllProfile
 }