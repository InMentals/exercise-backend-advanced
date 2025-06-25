import Product from "../models/Product.js";

export async function index(req, res, next) {
  try {
    const userId = req.session.userId;

    //Filters
    //http://localhost:3000/?name=...
    const filterName = req.query.name;

    //http://localhost:3000/api/products?min=0&max=1000...
    const min = req.query.min;
    const max = req.query.max;

    //http://localhost:3000/api/products?tags=motor&tags[]=work...
    const tags = [].concat(req.query.tags || []);

    //Pagination
    //http://localhost:3000/?limit=2&skip=2
    const limit = req.query.limit;
    const skip = req.query.skip;

    //Sorting
    //http://localhost:3000/?sort=name
    const sort = req.query.sort;

    //Fields selection
    //http://localhost:3000/api/products?fields=name%20-_id%20price
    const fields = req.query.fields;

    const filter = {
      owner: userId,
    };
    if (filterName) {
      filter.name = filterName;
    }

    res.locals.products = await Product.list(
      filter,
      min,
      max,
      tags,
      limit,
      skip,
      sort,
      fields
    );
    res.render("home");
  } catch (error) {
    next(error);
  }
}
