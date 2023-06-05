// Products.routes:

// Nunca validas que el body esta bien formado (libre de null, undefined o "")  ni que este no incluya un ID. >> corregido

// En la ruta post para crear productos, haces esto:

// productsRouter.post('/', async (req, res) => {
//     const newProduct = req.body;
//     await productManager.addProduct(newProduct);
//     res.status(201).json(newProduct);
// });
// Ahora, el newProduct no tiene un ID, si lo retornas finalmente, el producto que estas devolviendo NO tiene ID. >> corregido

// En el delete, puede llegar a decir "Producto no encontrado" inclusive si el producto con ese ID no estuvo nunca incluido. >> corregido

// 100% de lo logica se paso al Manager.

import express from "express";
import ProductManager from "../manager/productManager.js";

const productsRouter = express.Router();
const productManager = new ProductManager();

productsRouter.get("/", async (req, res) => {
  res.send(await productManager.getProducts());
});

productsRouter.get("/:id", async (req, res) => {
  let id = req.params.id;
  res.send(await productManager.getProductById(id));
});

productsRouter.post("/", async (req, res) => {
  let newProduct = req.body;
  res.send(await productManager.addProducts(newProduct));
});

productsRouter.put("/:id", async (req, res) => {
  let id = req.params.id;
  let updatedProduct = req.body;
  res.send(await productManager.updateProducts(id, updatedProduct));
});

productsRouter.delete("/:id", async (req, res) => {
  let id = req.params.id;
  res.send(await productManager.deleteProducts(id));
});

export default productsRouter;
