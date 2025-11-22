// Import required packages
const express = require("express");
const server = express();
const port = 3000;
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Get DB URI from .env file
const { DB_URI } = process.env;

// Import Product model
const Product = require("./models/product");

// Middleware
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cors());

// Connect to MongoDB
mongoose
  .connect(DB_URI)
  .then(() => {
    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.log("Error connecting to the database", error.message);
  });

// Test route
server.get("/", (request, response) => {
  response.send("Grocery API is Live");
});

// To GET all products
server.get("/products", async (request, response) => {
  try {
    const products = await Product.find();
    response.send(products);
  } catch (error) {
    response.status(500).send({ message: error.message });
  }
});

// To ADD a new product
server.post("/add-product", async (request, response) => {
  const { productName, brand, image, price } = request.body;

  const newProduct = new Product({
    productName,
    brand,
    image,
    price 
  });

  try {
    await newProduct.save();
    response.status(201).send({
      message: "Product added successfully"
    });
  } catch (error) {
    response.status(400).send({ message: error.message });
  }
});

// To DELETE a product by id
server.delete("/products/:id", async (request, response) => {
  const { id } = request.params;

  try {
    await Product.findByIdAndDelete(id);
    response.send({ message: `Product is deleted with id ${id}` });
  } catch (error) {
    response.status(400).send({ message: error.message });
  }
});

// To GET one product by id
server.get("/products/:id", async (request, response) => {
  const { id } = request.params;

  try {
    const productToEdit = await Product.findById(id);
    response.send(productToEdit);
  } catch (error) {
    response.status(500).send({ message: error.message });
  }
});

// To PATCH (update) a product by id
server.patch("/products/:id", async (request, response) => {
  const { id } = request.params;
  const { productName, brand, image, price } = request.body;

  try {
    await Product.findByIdAndUpdate(
      id,
      {
        productName,
        brand,
        image,
        price 
      },
      { new: true }
    );

    response.send({ message: "Product updated successfully" });
  } catch (error) {
    response.status(500).send({ message: error.message });
  }
});
