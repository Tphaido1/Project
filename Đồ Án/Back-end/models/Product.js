import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    name: String,
    price: Number,
    image: String,
    description: String,
    category: String,
    stock: Number,
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
