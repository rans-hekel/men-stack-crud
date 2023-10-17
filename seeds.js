const mongoose = require("mongoose");
const Product = require("./models/Product");

mongoose
  .connect("mongodb://localhost:27017/codepolitan")
  .then(() => {
    console.log("connect to mongoodb");
  })
  .catch((err) => {
    console.log(err);
  });

const seedProducts = [
  {
    name: "Kemeja Flanel",
    brand: "Hollister",
    price: 750000,
    color: "biru muda",
    category: "Baju",
    description:
      "Kemeja flanel dengan warna yang cerah, terbuat dari bahan flanel yang nyaman dan berkualitas tinggi.",
  },
  {
    name: "Celana Chino",
    brand: "Levi's",
    price: 900000,
    color: "krem",
    category: "Celana",
    description:
      "Celana chino dengan warna yang cerah dan desain yang simpel, terbuat dari bahan katun yang nyaman dipakai.",
  },
  {
    name: "Kacamata Aviator",
    brand: "Ray-Ban",
    price: 2000000,
    color: "emas",
    category: "Aksesoris",
    description:
      "Kacamata aviator dengan desain yang elegan dan klasik, terbuat dari bahan logam berkualitas tinggi.",
  },
  {
    name: "Baju Renang",
    brand: "Speedo",
    price: 500000,
    color: "biru tua",
    category: "Baju",
    description:
      "Baju renang dengan desain yang sporty dan ergonomis, terbuat dari bahan spandex yang nyaman dan tahan lama.",
  },
  {
    name: "Topi Baseball",
    brand: "New Era",
    price: 350000,
    color: "hitam",
    category: "Aksesoris",
    description:
      "Topi baseball dengan desain yang simpel dan elegan, terbuat dari bahan katun berkualitas tinggi.",
  },
  {
    name: "Rompi",
    brand: "Zara",
    price: 850000,
    color: "abu-abu",
    category: "Jaket",
    description:
      "Rompi dengan desain yang stylish dan modern, terbuat dari bahan wol yang nyaman dan berkualitas tinggi.",
  },
  {
    name: "Jas",
    brand: "Hugo Boss",
    price: 4500000,
    color: "hitam",
    category: "Jaket",
    description:
      "Jas dengan desain yang elegan dan klasik, terbuat dari bahan wol yang nyaman dan berkualitas tinggi.",
  },
  {
    name: "Sepatu Loafers",
    brand: "Gucci",
    price: 8000000,
    color: "coklat",
    category: "Aksesoris",
    description:
      "Sepatu loafers dengan desain yang mewah dan elegan, terbuat dari bahan kulit yang berkualitas tinggi.",
  },
];

Product.insertMany(seedProducts)
  .then((result) => {
    console.log(result);
  })
  .catch((err) => {
    console.log(err);
  });
