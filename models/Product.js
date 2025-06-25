import mongoose from "mongoose";

var productSchema = new mongoose.Schema({
  name: { type: String, index: true },
  owner: { ref: "User", type: mongoose.Schema.Types.ObjectId, index: true },
  price: { type: Number, index: true },
  image: String,
  tags: [String],
});

productSchema.statics.list = function (
  filterName,
  min,
  max,
  filterTags,
  limit,
  skip,
  sort,
  fields
) {
  let query = Product.find(filterName);
  if (min) query = query.where("price").gt(min);
  if (max) query = query.where("price").lt(max);
  if (filterTags.length) query = query.where("tags").all(filterTags);

  query.limit(limit);
  query.skip(skip);
  query.sort(sort);
  query.select(fields);
  return query.exec();
};

const Product = mongoose.model("Product", productSchema);

export default Product;
