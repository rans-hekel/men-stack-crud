const { mongoose, Schema } = require("mongoose");

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, "Product tidak boleh kosong"],
  },
  brand: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: [0, "Nilai Tidak Boleh Minus"],
  },
  color: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["Baju", "Celana", "Aksesoris", "Jaket"],
  },
  description: {
    type: String,
    required: true,
    maxLength: 150,
  },
  garment: {
    type: Schema.Types.ObjectId,
    ref: "Garment",
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
