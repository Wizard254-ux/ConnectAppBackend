const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Reference to User model
    required: true
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Reference to User model
    required: true
  },
  groupId: {
    type: String,
    required: true,
    index: true // Improves query performance
  },
  receiver: {
    type: String,
    required: true,
  },
  senderUsername: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read'],
    default: 'sent'
  }
});

const Message = mongoose.model('PrivateMessage', MessageSchema);
module.exports = Message;
