const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
  },
  fileUrl: {
    type: String,
    required: [true, 'Please add a file URL'],
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Product', productSchema);