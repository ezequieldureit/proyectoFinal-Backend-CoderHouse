import express from "express";
import ProductManager from "../manager/productManager.js";

const productsRouter = express.Router();
const productManager = new ProductManager();

productsRouter.use(express.json());
productsRouter.use(express.urlencoded({ extended: true }));

productsRouter.get("/", async (req, res) => {
  try {
    const result = await productManager.getProducts();
    res.status(200).json({
      status: "Success",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      motive: error.message,
      data: {},
    });
  }
});

productsRouter.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const productById = await productManager.getProductById(id);
    if (!productById) {
      res.status(404).json({
        status: "Error",
        motive: "Product not found",
        data: {},
      });
    } else {
      res.status(200).json({
        status: "Success",
        data: productById,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "Error",
      motive: error.message,
      data: {},
    });
  }
});

productsRouter.post("/", async (req, res) => {
  try {
    const newProduct = req.body;
    const result = await productManager.addProducts(newProduct);
    res.status(201).json({
      status: "Success",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      motive: error.message,
      data: {},
    });
  }
});

productsRouter.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedProduct = req.body;
    const result = await productManager.updateProducts(id, updatedProduct);
    if (!result) {
      res.status(404).json({
        status: "Error",
        motive: "Product not found",
        data: {},
      });
    } else {
      res.status(200).json({
        status: "Success",
        data: result,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "Error",
      motive: error.message,
      data: {},
    });
  }
});

productsRouter.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await productManager.deleteProducts(id);
    res.status(200).json({
      status: "Success",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      motive: error.message,
      data: {},
    });
  }
});

export default productsRouter;
