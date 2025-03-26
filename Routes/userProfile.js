const express = require('express')
const router = express.Router()
router.use(express.json())
const Authenticate = require('../Middleware/userAuthentication')
const upload = require('../Middleware/ProfileImagesHandler') // Updated Cloudinary upload middleware
const {
    createProfile, 
    handleDp, 
    handleProfilePics, 
    getProfile, 
    deleteImage, 
    updateProfile
} = require('../Controllers/UserProfile')

// Authentication middleware with exceptions
router.use((req, res, next) => {
    console.log(req.path)
    if (req.path.startsWith('/userDp/') || req.path.startsWith('/handle')) {
        return next(); // Skip authentication for these paths
    }
    // Otherwise, apply authentication
    Authenticate(req, res, next);
});

// Apply upload middleware to create and update routes
router.use(['/create', '/update'], upload.array('images', 5))

// Define routes
router.post('/create', createProfile)
router.get('/fetch', getProfile)
router.delete('/imageDelete', deleteImage)
router.put('/update', updateProfile)
router.get('/userDp/:username', handleDp)
router.get('/handleProfilePics/:picUrl', handleProfilePics)

module.exports = router