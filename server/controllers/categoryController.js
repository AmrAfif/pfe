const Category = require('../models/Category');

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCategory = async (req, res) => {
  const { name, icon } = req.body;
  try {
    const existing = await Category.findOne({ name: { $regex: new RegExp('^' + name + '$', 'i') } });
    if (existing) {
      return res.status(400).json({ message: 'Category already exists' });
    }
    const category = await Category.create({ name, icon });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (category) {
      await Category.deleteOne({ _id: req.params.id });
      res.json({ message: 'Category removed' });
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { name, icon } = req.body;
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    if (name) {
      const existing = await Category.findOne({ name: { $regex: new RegExp('^' + name + '$', 'i') } });
      if (existing && existing._id.toString() !== req.params.id) {
        return res.status(400).json({ message: 'Category name already exists' });
      }
      category.name = name;
    }
    if (icon) category.icon = icon;
    const updated = await category.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };