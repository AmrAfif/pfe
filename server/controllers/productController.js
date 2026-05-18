const Product = require('../models/Product');

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({}).populate('seller', 'name email');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('seller', 'name email');
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProduct = async (req, res) => {
  const { title, author, description, price, category, pages, stock } = req.body;

  try {
    const product = new Product({
      title,
      author,
      description,
      price,
      category,
      pages,
      stock,
      image: req.files?.image ? '/uploads/' + req.files.image[0].filename : '',
      fileUrl: req.files?.file ? '/uploads/' + req.files.file[0].filename : '',
      seller: req.user._id,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      if (req.user.role !== 'admin' && product.seller?.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized to update this product' });
      }

      product.title = req.body.title || product.title;
      product.author = req.body.author || product.author;
      product.description = req.body.description || product.description;
      product.price = req.body.price || product.price;
      product.category = req.body.category || product.category;
      product.pages = req.body.pages || product.pages;
      product.stock = req.body.stock != null ? req.body.stock : product.stock;
      if (req.files?.image) {
        product.image = '/uploads/' + req.files.image[0].filename;
      }
      if (req.files?.file) {
        product.fileUrl = '/uploads/' + req.files.file[0].filename;
      }

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      if (req.user.role !== 'admin' && product.seller?.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized to delete this product' });
      }
      await Product.deleteOne({ _id: req.params.id });
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyProducts,
};