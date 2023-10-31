const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const app = express();
const port = 3000;
const ErrorHandler = require("./ErrorHandler");

// model products
const Product = require("./models/product");
const Garment = require("./models/garment");

// connect to monggodb
mongoose
  .connect("mongodb://localhost:27017/codepolitan")
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
// bungkus function secara async buat errorhandler
function wrapAsync(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch((err) => next(err.message));
  };
}

app.get("/", (req, res) => {
  res.send("hello world");
});

app.get(
  "/garments",
  wrapAsync(async (req, res) => {
    const garments = await Garment.find({});
    res.render("garment/index", { garments });
  })
);

app.get("/garments/create", (req, res) => {
  res.render("garment/create");
});

app.post(
  "/garments",
  wrapAsync(async (req, res) => {
    const garment = new Garment(req.body);
    await garment.save();
    // req.flash('flash_messages', 'Berhasil menambahkan data Pabrik!')
    res.redirect(`/garments`);
  })
);

app.get(
  "/garments/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const garment = await Garment.findById(id).populate("products");
    res.render("garment/show", { garment });
  })
);

// /garments/:garment_id/product/create
app.get("/garments/:garment_id/product/create", (req, res) => {
  const { garment_id } = req.params;
  res.render("products/create", { garment_id });
});

// /garments/:garment_id/product/
app.post(
  "/garments/:garment_id/products",
  wrapAsync(async (req, res) => {
    const { garment_id } = req.params;
    const garment = await Garment.findById(garment_id);
    const product = new Product(req.body);
    garment.products.push(product);
    product.garment = garment;
    await garment.save();
    await product.save();
    console.log(garment);
    res.redirect(`/garments/${garment_id}`);
  })
);

app.delete(
  "/garments/:garment_id",
  wrapAsync(async (req, res) => {
    const { garment_id } = req.params;
    await Garment.findOneAndDelete({ _id: garment_id });
    res.redirect("/garments");
  })
);

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

app.get(
  "/products/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id).populate("garment");
    res.render("products/show", { product });
  })
);

app.get("/products/:id/edit", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render("products/edit", { product });
  } catch (error) {
    next(new ErrorHandler("product is not found", 404));
  }
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

app.use((err, req, res, next) => {
  console.dir(err);
  if (err.name === "ValidationError") {
    err.status = 400;
    err.message = Object.value(err.errors).map((item) => item.message);
  }
  if (err.name === "CastError") {
    err.status = 404;
    err.message = "product not found";
  }

  next(err);
});

app.use((err, req, res, next) => {
  const { status = 500, message = "something went wrong" } = err;
  res.status(status).send(message);
});

app.listen(port, () => {
  console.log(`server running in http://localhost:${port}`);
});
