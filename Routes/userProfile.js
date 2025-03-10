const express=require('express')
const router=express.Router()
router.use(express.json())

const Authenticate=require('../Middleware/userAuthentication')
const upload=require('../Middleware/ProfileImagesHandler')
const {createProfile,getProfile,deleteImage,updateProfile}=require('../Controllers/UserProfile')



router.use('/',[Authenticate])
router.use(['/create','/update'],[upload.array('images',5)])

router.use('/create',createProfile)
router.use('/fetch',getProfile)
router.use('/imageDelete',deleteImage)
router.use('/update',updateProfile)

module.exports=router