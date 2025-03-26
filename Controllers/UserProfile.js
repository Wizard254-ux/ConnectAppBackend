const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const fs = require('fs')
const app = express()
app.use(express.json())
const UserProfile = require('../Models/Profile.model')
const User = require('../Models/User.model')
const cloudinary = require('cloudinary').v2

const createProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const existingProfile = await UserProfile.findOne({ userId: userId });
        if (existingProfile) {
          return res.status(400).json({ error: 'Profile already exists for this user' });
        }

        const profileData = {
            userId: userId,
            ...req.body,
            images: req.files.map(file => file.path) // Now stores Cloudinary URLs
        };  
        
        const profile = await UserProfile.create(profileData)
        const data = {
            ...profile._doc,
            images: profile.images // Directly use Cloudinary URLs
        }
        
        res.status(201).json({message:"successful", data})
    } catch(error) {
        res.status(500).json({message: error.message})
    }
}

const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const existingProfile = await UserProfile.findOne({ userId: userId });
        if (!existingProfile) {
          return res.status(404).json({ error: 'Profile does not exist for this user' });
        }

        const profile = {
            ...existingProfile._doc,
            images: existingProfile.images // Already contains Cloudinary URLs
        }

        res.status(201).json({message:"successful", data: profile})
    } catch(error) {
        res.status(500).json({message: error.message})
    }
}

const deleteImage = async (req, res) => {
    try {
        const userId = req.user.id;
        const imageUrl = req.query.imageUrl; // Changed from imageName to imageUrl

        if (!imageUrl) {
          return res.status(400).send({message:'You must provide image URL'})
        }

        const existingProfile = await UserProfile.findOne({ userId: userId });
        if (!existingProfile) {
            return res.status(404).json({ error: 'Profile does not exist for this user' });
        }

        // Extract public ID from Cloudinary URL
        const publicId = imageUrl.split('/').pop().split('.')[0];

        // Delete image from Cloudinary
        await cloudinary.uploader.destroy(publicId);

        // Remove image from profile
        const newImages = existingProfile.images.filter(url => url !== imageUrl)
        await UserProfile.updateOne({ userId: userId }, { images: newImages })
           
        res.status(200).json({message:"successful", data: newImages})
    } catch(error) {
        console.log(error.message)
        res.status(500).json({message: error.message})
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
            // Add new Cloudinary URLs to existing images
            req.files.map(file => {
                images.push(file.path);
            });
        }

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

        const updatedProfile = await UserProfile.findOneAndUpdate(
            { userId: userId },
            { $set: updateFields },
            { new: true }
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

const handleDp = async (req, res) => {
  try {
    console.log(req.params,'hello')
      const username = req.params.username
      const existingUser = await User.findOne({username})
      
      if (!existingUser) {
          return res.status(404).json({message: 'User not found'})
      }
      
      const existingProfile = await UserProfile.findOne({userId: existingUser.id})
      
      if (existingProfile && existingProfile.images.length > 0) {
          // Directly send the first image URL
          res.json({ imageUrl: existingProfile.images[0] });
        } else {
          // If no profile image, send a 404
          res.status(404).json({message: 'Profile picture not found'})
      }
  } catch (error) {
      res.status(500).json({message: error.message})
  }
}

const handleProfilePics = (req, res) => {
    const picUrl = req.params.picUrl
    if (picUrl) {
      console.log(picUrl)
        // Simply return the Cloudinary URL
        res.json({ imageUrl: picUrl });
    } else {
        res.status(404).json({message: 'Picture not found'})
    }
}

module.exports = {
    createProfile,
    getProfile,
    deleteImage,
    updateProfile,
    handleDp,
    handleProfilePics
}