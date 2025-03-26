const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const fs = require('fs')
const app = express()
app.use(express.json())
const UserProfile = require('../Models/Profile.model')

const getAllProfile = async (req, res) => {
    try {
        console.log(req.user)
        
        // Fetch all profiles and populate user details
        const existingProfiles = await UserProfile.find().populate('userId', 'username _id role');
        
        // If no profiles exist, return empty array
        if (!existingProfiles || existingProfiles.length === 0) {
            return res.status(200).json({ message: "successful", profiles: [] });
        }

        // Map profiles to include Cloudinary URLs directly
        const data = existingProfiles.map(profile => ({
            ...profile._doc,
            images: profile.images // Already contains Cloudinary URLs
        }));

        res.status(200).json(data)
    } catch(error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

module.exports = {
    getAllProfile
}