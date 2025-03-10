const express=require('express')
const router=express.Router()

const {getAllProfile}=require('../Controllers/General')
const Authenticate=require('../Middleware/userAuthentication')

router.get('/profiles',Authenticate,getAllProfile)

module.exports=router
