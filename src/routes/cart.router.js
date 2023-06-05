// Carts.routes

// En el get por ID del carrito, haces esto:

// id: await cartManager.generateCartId(),
// Pero el endpoint no es el que debe pedirle al CartManager un ID sino pedirle que cree directamente el cart y este se lo retorne, con ID y todo. >> corregido

// En el post de agregar un producto a un carrito, asumis que el quantity te viene por body pero esto no es así segun el enunciado. El quantity se calcula y se va incrementando de a uno. Es decir, la primera vez que se agrega un producto al carrito su quantity es 1, y luego se va incrementando sobre este valor. >> corregido
// 100% de lo logica se paso al cartManager.

import express from "express";
import CartManager from "../manager/cartManager.js";

const cartRouter = express.Router();
const cartManager = new CartManager();

cartRouter.post("/", async (req, res) => {
  res.send(await cartManager.addCarts());
});

cartRouter.get("/", async (req, res) => {
  res.send(await cartManager.readCart());
});

cartRouter.get("/:id", async (req, res) => {
  res.send(await cartManager.getCartById(req.params.id));
});

cartRouter.post("/:cid/products/:pid", async (req, res) => {
  let cartId = req.params.cid;
  let productId = req.params.pid;
  res.send(await cartManager.addProductInCart(cartId, productId));
});

export default cartRouter;
