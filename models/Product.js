import mongoose from "mongoose";

var productSchema = new mongoose.Schema({
  name: { type: String, index: true },
  owner: { ref: "User", type: mongoose.Schema.Types.ObjectId, index: true },
  price: { type: Number, index: true },
  image: String,
  tags: [String],
});

productSchema.statics.list = function (filter, limit, skip, sort, fields) {
  const query = Product.find(filter);
  query.limit(limit);
  query.skip(skip);
  query.sort(sort);
  query.select(fields);
  return query.exec();
};

const Product = mongoose.model("Product", productSchema);

export default Product;
