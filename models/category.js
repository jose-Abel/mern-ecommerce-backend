const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    maxlength: 32
  }
}, {timestamps: true});


const Category = mongoose.model("Category", categorySchema);

module.exports = Category;