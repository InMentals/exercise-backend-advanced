import Product from "../models/Product.js";

export async function index(req, res, next) {
  try {
    const userId = req.session.userId;

    //Filters
    //http://localhost:3000/?name=...
    const filterName = req.query.name;

    //Pagination
    //http://localhost:3000/?limit=2&skip=2
    const limit = req.query.limit;
    const skip = req.query.skip;

    //Sorting
    //http://localhost:3000/?sort=name
    const sort = req.query.sort;

    const filter = {
      owner: userId,
    };
    if (filterName) {
      filter.name = filterName;
    }

    res.locals.products = await Product.list(filter, limit, skip, sort);
    res.render("home");
  } catch (error) {
    next(error);
  }
}
