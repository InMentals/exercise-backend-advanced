import Product from '../models/Product.js'

export async function index(req, res, next) {
  try {
    const userId = req.session.userId;

    res.locals.products = await Product.find({owner: userId});
    res.render('home');

  } catch (error) {
    next(error);
  }
}
