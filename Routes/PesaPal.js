const express=require('express')
const router=express.Router()
const {ipnHandler,clubipnHandler,checkClubPaymentStatus,callbackHandler,checkPaymentStatus}=require('../Controllers/PesaPal')
const Authenticate=require('../Middleware/userAuthentication')

router.use('/callback',callbackHandler)
router.use('/ipn',ipnHandler)
router.use('/clubipn',clubipnHandler)
router.get('/check-payment-status/:orderTrackingId',Authenticate,checkPaymentStatus)
router.get('/club-check-payment-status/:orderTrackingId',Authenticate,checkClubPaymentStatus)

module.exports=router