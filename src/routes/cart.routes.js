import express from "express";
import CartManager from "../manager/cartManager.js";

const cartRouter = express.Router();
const cartManager = new CartManager();

cartRouter.use(express.json());
cartRouter.use(express.urlencoded({ extended: true }));

cartRouter.post("/", async (req, res) => {
  try {
    const result = await cartManager.addCarts();
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

cartRouter.get("/", async (req, res) => {
  try {
    const result = await cartManager.readCart();
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

cartRouter.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const cartById = await cartManager.getCartById(id);
    if (!cartById) {
      res.status(404).json({
        status: "Error",
        motive: "Cart not found",
        data: {},
      });
    } else {
      res.status(200).json({
        status: "Success",
        data: cartById,
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

cartRouter.post("/:cid/products/:pid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const cart = await cartManager.addProductToCart(cartId, productId);
    if (!cart) {
      res.status(404).json({
        status: "Error",
        motive: "Cart not found",
        data: {},
      });
    } else {
      res.status(201).json({
        status: "Success",
        data: cart,
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

export default cartRouter;
