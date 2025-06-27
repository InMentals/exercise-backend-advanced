import Product from "../models/Product.js";
import { unlink } from "node:fs/promises";
import path from "node:path";

export function index(req, res, next) {
  res.render("new-product");
}

export async function postNew(req, res, next) {
  try {
    const { name, price } = req.body;
    const userId = req.session.userId;
    const product = new Product({
      name,
      price,
      image: req.file ? req.file.filename : "",
      owner: userId,
    });
    if (req.body.work === "") product.tags = [...product.tags, "work"];
    if (req.body.lifestyle === "")
      product.tags = [...product.tags, "lifestyle"];
    if (req.body.motor === "") product.tags = [...product.tags, "motor"];
    if (req.body.mobile === "") product.tags = [...product.tags, "mobile"];
    await product.save();

    res.redirect("/");
  } catch (error) {
    next(error);
  }
}

export async function deleteProduct(req, res, next) {
  try {
    const userId = req.session.userId;
    const productId = req.params.productId;
    const product = await Product.findById(productId);

    await Product.deleteOne({ _id: productId, owner: userId });
    if (product.image) {
      const imagePath = path.join(
        import.meta.dirname,
        "..",
        "..",
        "public",
        "productImages",
        product.image
      );
      try {
        await unlink(imagePath);
      } catch (error) {}
    }

    res.redirect("/");
  } catch (error) {
    next(error);
  }
}
