import path from "node:path";
import Product from "../../models/Product.js";
import { unlink } from "node:fs/promises";
import createError from "http-errors";

export async function list(req, res, next) {
  try {
    const userId = req.apiUserId;

    //Filters
    //http://localhost:3000/api/products?name=...
    const filterName = req.query.name;
    //TODO implement price & tags filter

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
      owner: userId,
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
    const userId = req.apiUserId;
    const product = await Product.findOne({ _id: productId, owner: userId });
    if (!product) {
      return next(createError(404));
    }
    res.json({ result: product });
  } catch (error) {
    next(error);
  }
}

export async function newProduct(req, res, next) {
  try {
    const productData = req.body;
    const userId = req.apiUserId;
    //TODO product data validation

    // create product in memory
    const product = new Product(productData);
    product.image = req.file?.filename;
    product.owner = userId;

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
    const userId = req.apiUserId;
    const productData = req.body;
    productData.image = req.file?.filename;
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: productId, owner: userId },
      productData,
      { new: true } // returns the updated document
    );
    if (!updatedProduct) {
      return next(createError(404));
    }
    res.json({ result: updatedProduct });
  } catch (error) {
    next(error);
  }
}

export async function deleteProduct(req, res, next) {
  try {
    const productId = req.params.productId;
    const userId = req.apiUserId;

    const product = await Product.findById(productId);

    if (!product) {
      console.log(
        `WARNING! user${userId} is trying to delete a non existing product`
      );
      return next(createError(404));
    }
    // validate the document (product) to be property of user
    if (product.owner.toString() !== userId) {
      console.log(
        `WARNING! user${userId} is trying to delete a product not belonging to him`
      );
      return next(createError(401));
    }

    // remove image file if the products has it and is
    if (product.image) {
      try {
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
      } catch {}
    }

    await Product.deleteOne({ _id: productId });

    res.json();
  } catch (error) {
    next(error);
  }
}
