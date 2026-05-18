const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
  },
  author: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
  },
  image: {
    type: String,
    default: '',
  },
  fileUrl: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
  },
  pages: {
    type: Number,
    default: 0,
  },
  stock: {
    type: Number,
    default: 0,
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Product', productSchema);