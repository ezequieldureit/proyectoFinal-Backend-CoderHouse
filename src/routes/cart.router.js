import express from "express";
import CartManager from "../cartManager.js";

const cartRouter = express.Router();
const cartManager = new CartManager("carrito.json");

cartRouter.post("/", async (req, res) => {
  const newCart = {
    id: await cartManager.generateCartId(),
    products: [],
  };

  await cartManager.addCart(newCart);
  res.json(newCart);
});

cartRouter.get("/:cid", async (req, res) => {
  const cartId = req.params.cid;
  const cart = await cartManager.getCartById(cartId);

  if (cart) {
    res.status(200).json(cart.products);
  } else {
    res.status(404).json({ error: "Carrito no encontrado" });
  }
});

cartRouter.post("/:cid/products/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = parseInt(req.params.pid);
  const quantity = req.body.quantity || 1;

  const cart = await cartManager.getCartById(cartId);
  if (!cart) {
    res.status(404).json({ error: "Carrito no encontrado" });
    return;
  }

  const existingProduct = cart.products.find((p) => p.product === productId);
  if (existingProduct) {
    existingProduct.quantity += quantity;
  } else {
    cart.products.push({ product: productId, quantity });
  }

  await cartManager.updateCart(cartId, productId, quantity);
  res.status(201).json({ message: "Producto agregado al carrito" });
});

export default cartRouter;

//Testing process>>
// POST create cart >> OK
// GET cart by ID >> OK
// POST product in the cart by ID >> OK
