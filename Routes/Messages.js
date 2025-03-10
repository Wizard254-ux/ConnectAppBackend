const express=require('express')
const router=express.Router()

const Authenticate=require('../Middleware/userAuthentication')
const {fetchAllUserMessages}=require('../Controllers/PrivateChat')

router.get('/messages',Authenticate,fetchAllUserMessages)
module.exports=router