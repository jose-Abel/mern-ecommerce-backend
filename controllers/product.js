const fs = require('fs');
const formidable = require('formidable');
const _ = require('lodash');
const Product = require('../models/product');
const {errorHandler} = require('../helpers/dbErrorHandler');
const { response } = require('express');

exports.productById = (req, res, next, id) => {
  Product.findById(id).exec((err, product) => {
    if (err || !product) {
      return res.status(400).json({
        error: "Product not found"
      })
    }

    req.product = product;

    next();
  });
}

exports.read = (req, res) => {
  req.product.photo = undefined;

  return res.status(200).json(req.product);
}

exports.create = (req, res) => {
  let form = new formidable.IncomingForm();

  form.keepExtensions = false;

  form.parse(req, (err, fields, files) => {
    if(err) {
      return res.status(400).json({
        error: 'Image could not be uploaded'
      });
    }

    // Check for all fields
    const { name, description, price, category, quantity, shipping } = fields;

    if (!name || !description || !price || !category || !quantity || !shipping) {
      return res.status(400).json({
        error: 'All fields are required'
      });
    }

    let product = new Product(fields);

    if(files.photo) {
      if(files.photo.size > 1000000) {
        return res.status(400).json({
          error: 'Image should be less than 1MB in size'
        });
      }

      product.photo.data = fs.readFileSync(files.photo.filepath);
  
      product.photo.contentType = files.photo.mimetype;
    }

    product.save((err, result) => {
      if(err) {
        return res.status(400).json({
          error: errorHandler(error)
        });
      }
      res.json(result);
    });
  });
}

exports.remove = (req, res) => {
  let product = req.product

  product.remove((err, deletedProduct) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(error)
      });
    }

    response.json({
      message: "Product deleted successfully"
    });
  })
}

exports.update = (req, res) => {
  let form = new formidable.IncomingForm();

  form.keepExtensions = false;

  form.parse(req, (err, fields, files) => {
    if(err) {
      return res.status(400).json({
        error: 'Image could not be uploaded'
      });
    }

    // Check for all fields
    const { name, description, price, category, quantity, shipping } = fields;

    if (!name || !description || !price || !category || !quantity || !shipping) {
      return res.status(400).json({
        error: 'All fields are required'
      });
    }

    let product = req.product;

    product = _.extend(product, fields);

    if(files.photo) {
      if(files.photo.size > 1000000) {
        return res.status(400).json({
          error: 'Image should be less than 1MB in size'
        });
      }

      product.photo.data = fs.readFileSync(files.photo.filepath);
  
      product.photo.contentType = files.photo.mimetype;
    }

    product.save((err, result) => {
      if(err) {
        return res.status(400).json({
          error: errorHandler(error)
        });
      }
      res.json(result);
    });
  });
}