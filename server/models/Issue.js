const mongoose = require('mongoose');

const IssueSchema = new mongoose.Schema({
  orderId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Order', 
    required: true 
  },
  customerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  issueType: { 
    type: String, 
    enum: ['damaged_product', 'late_delivery', 'wrong_quantity', 'missing_items', 'worker_behavior', 'other'], 
    required: true 
  },
  description: { 
    type: String, 
    required: true,
    maxlength: 1000 
  },
  status: { 
    type: String, 
    enum: ['pending', 'investigating', 'resolved', 'rejected'], 
    default: 'pending' 
  },
  resolution: { 
    type: String 
  },
  resolvedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  resolvedAt: { 
    type: Date 
  },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high', 'urgent'], 
    default: 'medium' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Issue', IssueSchema);
