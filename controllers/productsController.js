import Product from "../models/Product.js";

export function index(req, res, next) {
  res.render("new-product");
}

export async function postNew(req, res, next) {
  try {
    const { name, price, image } = req.body;
    const userId = req.session.userId;
    const product = new Product({
      name,
      price,
      image: req.file.filename,
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

    await Product.deleteOne({ _id: productId, owner: userId });

    res.redirect("/");
  } catch (error) {
    next(error);
  }
}
