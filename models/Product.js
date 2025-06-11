import mongoose from "mongoose";

var productSchema = new mongoose.Schema({
    name: String,
    owner: { ref: 'User', type: mongoose.Schema.Types.ObjectId, index: true},
    price: Number,
    image: String,
    tags: [String]
});

const Product =  mongoose.model('Product', productSchema);

export default Product;