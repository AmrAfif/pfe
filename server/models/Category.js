const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a category name'],
    unique: true,
    trim: true,
  },
  icon: {
    type: String,
    default: '📚',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Category', categorySchema);