const mongoose = require('mongoose');

const UserTransactionSchema = new mongoose.Schema({
    orderTrackingId: {
        type: String,  // Added missing type
        required: [true, 'Order Tracking id missing'],  // Fixed 'require' to 'required'
        // unique: true
    },
    orderMerchantReference: {
        type: String,  // Added missing type
        required: [true, 'Order Merchant Ref is missing'],  // Fixed 'require' to 'required'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        // required: [true, 'User reference id Missing']  // Fixed 'require' to 'required'
    },
    amount: {
        type: Number,
        required: [true, 'Amount missing']
    },
    paymentMethod: {
        type: String,
        required: [true, 'Payment method missing']  // Fixed error message
    },
    paymentAccount: {
        type: String,
        required: [true, 'Payment Account Number missing']
    },
    paymentMethod: {
        type: String,
    },
    
    paymentCurrency: {
        type: String,
    },
    confirmationCode: {
        type: String,
        required: [true, 'Confirmation code missing'],  // Fixed 'require' to 'required'
        // unique: true
    },
    paymentStatusCode: {
        type: Number,
    },
    paymentStatusDescription: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed'],
        default: 'pending'
    },
    subscriptionType:{
        type:String,
        enum:['Club','Member'],
        required:true
    }
}, {
    timestamps: true  // Added timestamps for createdAt and updatedAt
});

const UserTransaction = mongoose.model("UserTransaction", UserTransactionSchema);
module.exports = UserTransaction;  // Fixed export