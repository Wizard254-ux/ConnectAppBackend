const express=require('express')
const app=express()
const jwt=require('jsonwebtoken')
const User=require('../Models/User.model')
const UserTransaction=require('../Models/UserTransaction.model.js')
app.use(express.json())
const bcrypt=require('bcryptjs')

// Callback Function for handling payment status responses from Pesapal
const callbackHandler = async (req, res) => {
    const { paymentStatus, transactionId, amount, reference, paymentMethod } = req.body;
        console.log(req.body)
    try {
        // const user = await User.findById(reference); // reference is userId in this case

        // if (!user) {
        //     return res.status(404).send('User not found');
        // }

        // Handle the payment status (success, failure, cancelled)
        if (paymentStatus === 'SUCCESS') {
            // Handle success, e.g., update user profile, mark order as paid
            // const profile = await Profile.findOne({ userId: user._id });
            // if (!profile) {
            //     return res.status(404).send('Profile not found');
            // }

            // // Update the profile or any other related entity
            // profile.paymentStatus = 'Paid';
            // await profile.save();

            console.log('transaction success')

            return res.status(200).send('Payment Success Processed');
        } else if (paymentStatus === 'FAILED') {
            return res.status(400).send('Payment Failed');
        } else if (paymentStatus === 'CANCELLED') {
            return res.status(400).send('Payment Cancelled');
        } else {
            return res.status(400).send('Unknown payment status');
        }
    } catch (error) {
        console.error('Error processing payment callback:', error);
        return res.status(500).send('Internal Server Error');
    }
};
const ipnHandler = async (req, res) => {
    try {
        console.log(req.body,'ipn handler')
            const tokenResponse = await fetch('https://pay.pesapal.com/v3/api/Auth/RequestToken', {
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  consumer_key: 'qrNVB57NcFZaNu6akUK9gPmy5fIirkwE',
                  consumer_secret: 'TmEGzFKcMfNABJFqJc9ANC/ag2I='
                })
              });

            const tokenData=await tokenResponse.json()
            console.log(tokenData)
            const orderTrackingId=req.body.orderTrackingId
            const url = `https://pay.pesapal.com/v3/api/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`;
        
        const res = await fetch(url, {
            method: 'GET', // Use GET method
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenData.token}` // Include the Bearer token
            }
        });

        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }
         const data=await res.json()

        console.log('order infor ',data)
        if(data.status_code===1){
            // Handle success, e.g., update user profile, mark order as paid
            const userTransaction=new UserTransaction({
                orderTrackingId:data.order_tracking_id,
                orderMerchantReference:data.merchant_reference,
                amount:data.amount,
                confirmationCode:data.confirmation_code,
                paymentAccount:data.payment_account,
                paymentStatusDescription:data.payment_status_description,
                paymentStatusCode:data.status_code,
                paymentMethod:data.MpesaKE,
                paymentCurrency:data.currency,
                subscriptionType:'Member'


            })
            await userTransaction.save()
            console.log('transaction success')
        }

        }catch(error){
            console.log(error)
        
    

        console.error('Error processing IPN:', error);
        return res.status(500).send('Internal Server Error');

        }
    
};
const clubipnHandler = async (req, res) => {
    try {
        console.log(req.body,'ipn handler')
            const tokenResponse = await fetch('https://pay.pesapal.com/v3/api/Auth/RequestToken', {
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  consumer_key: 'qrNVB57NcFZaNu6akUK9gPmy5fIirkwE',
                  consumer_secret: 'TmEGzFKcMfNABJFqJc9ANC/ag2I='
                })
              });

            const tokenData=await tokenResponse.json()
            console.log(tokenData)
            const orderTrackingId=req.body.orderTrackingId
            const url = `https://pay.pesapal.com/v3/api/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`;
        
        const res = await fetch(url, {
            method: 'GET', // Use GET method
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenData.token}` // Include the Bearer token
            }
        });

        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }
         const data=await res.json()

        console.log('club info handler  ',data)
        if(data.status_code===1){
            // Handle success, e.g., update user profile, mark order as paid
            const userTransaction=new UserTransaction({
                orderTrackingId:data.order_tracking_id,
                orderMerchantReference:data.merchant_reference,
                amount:data.amount,
                confirmationCode:data.confirmation_code,
                paymentAccount:data.payment_account,
                paymentStatusDescription:data.payment_status_description,
                paymentStatusCode:data.status_code,
                paymentMethod:data.MpesaKE,
                paymentCurrency:data.currency,
                subscriptionType:'Club'


            })
            await userTransaction.save()
            console.log('transaction success')
        }

        }catch(error){
            console.log(error)
        
    

        console.error('Error processing IPN:', error);
        return res.status(500).send('Internal Server Error');

        }
    
};

const checkPaymentStatus=async (req,res)=>{
    try{
        const OrderTrackingId=req.params.orderTrackingId
        console.log('checking transaction ',OrderTrackingId)
        const userTransaction=await UserTransaction.findOne({orderTrackingId:OrderTrackingId}).sort({createdAt:-1}).limit(1)
        if(!userTransaction){
            return res.status(200).json({message:'Transaction not found',status:'invalid'})
        }
        const updatedTransaction = await UserTransaction.findOneAndUpdate(
            { _id: userTransaction._id }, // Find by transaction ID
            { $set: { userRef: req.user.id } }, // Update the userRef field
            { new: true } // Return the updated document
        );
        res.json({transactionData:updatedTransaction,status:updatedTransaction.paymentStatusDescription})
    }catch(error){
        res.status(500).json({message:error.message})
    }
}
const checkClubPaymentStatus=async (req,res)=>{
    try{
        const OrderTrackingId=req.params.orderTrackingId
        console.log('checking transaction ',OrderTrackingId)
        const userTransaction=await UserTransaction.findOne({orderTrackingId:OrderTrackingId}).sort({createdAt:-1}).limit(1)
        if(!userTransaction){
            return res.status(200).json({message:'Transaction not found',status:'invalid'})
        }
        const updatedTransaction = await UserTransaction.findOneAndUpdate(
            { _id: userTransaction._id }, // Find by transaction ID
            { $set: { userRef: req.user.id } }, // Update the userRef field
            { new: true } // Return the updated document
        );
        res.json({transactionData:updatedTransaction,status:updatedTransaction.paymentStatusDescription})
    }catch(error){
        res.status(500).json({message:error.message})
    }
 
}



module.exports={
    callbackHandler,
    ipnHandler,
    checkPaymentStatus,
    clubipnHandler,
    checkClubPaymentStatus
}