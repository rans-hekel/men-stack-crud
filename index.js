const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const app = express();
const port = 3000;

// model products
const Product = require("./models/Product");

// connect to monggodb
mongoose
  .connect("mongodb://localhost:27017/shop_app")
  .then(() => {
    console.log("connect to mongoodb");
  })
  .catch((err) => {
    console.log(err);
  });

// override with the X-HTTP-Method-Override header in the request
app.use(methodOverride("_method"));
// agar memparsing data untuk format .json
app.use(express.json());
// ini untuk midlewaree agar tidak undefind karena default post adalah undefined
app.use(express.urlencoded({ extended: true }));
// ejs
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.send("hello world");
});

app.get("/products", async (req, res) => {
  const { category } = req.query;
  if (category) {
    const products = await Product.find({ category });
    res.render("products/index", { products, category });
  } else {
    const products = await Product.find({});
    res.render("products/index", { products });
  }
});

app.get("/products/create", (req, res) => {
  res.render("products/create");
});

app.post("/products", async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.redirect(`/products/${product._id}`);
});

app.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  res.render("products/show", { product });
});

app.get("/products/:id/edit", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  res.render("products/edit", { product });
});

app.put("/products/:id", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndUpdate(id, req.body, {
    runValidator: true,
  });
  res.redirect(`/products/${product._id}`);
});

app.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndDelete(id);
  res.redirect(`/products`);
});

app.listen(port, () => {
  console.log(`server running in http://localhost:${port}`);
});
