import Product from "../../models/Product.js";

export async function list(req, res, next) {
  try {
    const products = await Product.list();
    res.json({ results: products });
  } catch (error) {
    next(error);
  }
}
