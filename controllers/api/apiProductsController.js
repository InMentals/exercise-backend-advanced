import path from "node:path";
import Product from "../../models/Product.js";
import { unlink } from "node:fs/promises";

export async function list(req, res, next) {
  try {
    //TODO implement API authentication
    //const userId = req.session.userId;

    //Filters
    //http://localhost:3000/api/products?name=...
    const filterName = req.query.name;
    //TODO implement price filter

    //Pagination
    //http://localhost:3000/api/products?limit=2&skip=2
    const limit = req.query.limit;
    const skip = req.query.skip;

    //Sorting
    //http://localhost:3000/api/products?sort=name
    const sort = req.query.sort;

    //Fields selection
    //http://localhost:3000/api/products?fields=name%20-_id%20price
    const fields = req.query.fields;

    //With total count
    const withCount = req.query.count === "true";

    const filter = {
      //TODO implement API authentication
      //owner: userId,
    };
    if (filterName) {
      filter.name = filterName;
    }

    const products = await Product.list(filter, limit, skip, sort, fields);
    const result = { results: products };
    if (withCount) {
      const count = await Product.countDocuments(filter);
      result.count = count;
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function getOne(req, res, next) {
  try {
    const productId = req.params.productId;
    const product = await Product.findById(productId);
    res.json({ result: product });
  } catch (error) {
    next(error);
  }
}

export async function newProduct(req, res, next) {
  try {
    const productData = req.body;

    // create product in memory
    const product = new Product(productData);
    product.image = req.file?.filename;

    // save product
    const savedProduct = await product.save();

    res.status(201).json({ result: savedProduct });
  } catch (error) {
    next(error);
  }
}

export async function update(req, res, next) {
  try {
    const productId = req.params.productId;
    const productData = req.body;
    productData.image = req.file?.filename;
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      productData,
      { new: true }
    );
    res.json({ result: updatedProduct });
  } catch (error) {
    next(error);
  }
}

export async function deleteProduct(req, res, next) {
  try {
    const productId = req.params.productId;
    // remove image file if exists
    const product = await Product.findById(productId);
    if (product.image) {
      await unlink(
        path.join(
          import.meta.dirname,
          "..",
          "..",
          "public",
          "productImages",
          product.image
        )
      );
    }

    await Product.deleteOne({ _id: productId });

    res.json();
  } catch (error) {
    next(error);
  }
}
