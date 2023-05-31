import express from 'express';
import ProductManager from '../productManager.js';

const productsRouter = express.Router();
const productManager = new ProductManager('products.json');


// Ruta GET para obtener todos los productos y por limit
productsRouter.get('/', async (req, res) => {
  const limit = parseInt(req.query.limit);
  const products = await productManager.getProducts();
  
  if (!isNaN(limit)) {
    const limitedProducts = products.slice(0, limit);
    res.json(limitedProducts);
  } else {
    res.json(products);
  }
});


// Ruta GET para obtener un producto por su ID
productsRouter.get('/:pid', async (req, res) => {
  const productId = parseInt(req.params.pid);
  const product = await productManager.getProductById(productId);
  
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

// Ruta PUT para actualizar un producto por su ID
productsRouter.put('/:pid', async (req, res) => {
  const productId = parseInt(req.params.pid);
  const updatedProduct = req.body;
  const product = await productManager.getProductById(productId);

  if (!product) {
    res.status(404).json({ error: 'Producto no encontrado' });
    return;
  }
  await productManager.updateProduct(productId, updatedProduct);
  res.status(200).json({ message: `Producto con ID ${productId} actualizado` });
});

// Ruta POST para crear un nuevo producto
productsRouter.post('/', async (req, res) => {
  const newProduct = req.body;
  await productManager.addProduct(newProduct);
  res.status(201).json(newProduct);
});

// Ruta DELETE para eliminar un producto por su ID
productsRouter.delete('/:pid', async (req, res) => {
  const productId = parseInt(req.params.pid);
  await productManager.deleteProduct(productId);
  res.json({ message: `Producto con ID ${productId} eliminado` });
});

export default productsRouter;

// Testing process>>
// GET All products >> OK
// GET products by limit >> OK
// GET product by ID >> OK
// PUT product by ID >> OK
// POST product >> OK
// DELETE product by ID >> OK

