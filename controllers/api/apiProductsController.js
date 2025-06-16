import Product from "../../models/Product.js";

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
