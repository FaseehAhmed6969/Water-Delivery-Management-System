const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema({
  orderId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Order', 
    required: true,
    unique: true // One rating per order
  },
  customerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  workerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  rating: { 
    type: Number, 
    required: true,
    min: 1,
    max: 5 
  },
  feedback: { 
    type: String,
    maxlength: 500 
  },
  deliverySpeed: { 
    type: Number,
    min: 1,
    max: 5 
  },
  productQuality: { 
    type: Number,
    min: 1,
    max: 5 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Rating', RatingSchema);
