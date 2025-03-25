const express=require('express')
const router=express.Router()
router.use(express.json())

const Authenticate=require('../Middleware/userAuthentication')
const upload=require('../Middleware/ProfileImagesHandler')
const {createProfile,handleDp,getProfile,deleteImage,updateProfile}=require('../Controllers/UserProfile')



router.use((req, res, next) => {
    console.log(req.path)
    if (req.path.startsWith('/userDp/')) {
        return next(); // Skip authentication for this specific path pattern
      }
    // Otherwise, apply authentication
    Authenticate(req, res, next);
  });

router.use(['/create','/update'],[upload.array('images',5)])

router.use('/create',createProfile)
router.use('/fetch',getProfile)
router.use('/imageDelete',deleteImage)
router.use('/update',updateProfile)
router.use('/userDp/:username',handleDp)

module.exports=router