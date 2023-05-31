import fs from "fs";

class ProductManager {
  constructor(filePath) {
    this.filePath = filePath;
  }

  async getProducts() {
    try {
      const fileData = await fs.promises.readFile(this.filePath, "utf-8");
      const products = JSON.parse(fileData);
      return products;
    } catch (error) {
      console.log("Error al cargar los productos desde el archivo:", error);
      return [];
    }
  }

  async saveProducts(products) {
    try {
      const productsString = JSON.stringify(products, null, 2);
      await fs.promises.writeFile(this.filePath, productsString);
    } catch (error) {
      console.log("Error al guardar los productos en el archivo:", error);
    }
  }

  async updateProduct(productId, updatedProduct) {
    const products = await this.getProducts();
    const productIndex = products.findIndex((p) => p.id === productId);

    if (productIndex === -1) {
      console.log(`Error: el producto con ID ${productId} no existe.`);
      return;
    }

    products[productIndex] = { ...products[productIndex], ...updatedProduct };

    await this.saveProducts(products);
    console.log(`Producto con ID ${productId} actualizado.`);
  }

  async addProduct(product) {
    const { title, description, price, code, stock, category } = product;
    if (!title || !description || !price || !code || !stock || !category) {
      console.log("Todos los campos son obligatorios");
      return;
    }

    const products = await this.getProducts();

    const existingProduct = products.find((p) => p.code === code);
    if (existingProduct) {
      console.log(
        `Error: el código ${code} ya está siendo utilizado por otro producto.`
      );
      return;
    }

    const lastProductId =
      products.length > 0 ? products[products.length - 1].id : 0;
    const newProductId = lastProductId + 1;

    const newProduct = {
      id: newProductId,
      ...product,
      status: true,
      thumbnails: [],
    };

    products.push(newProduct);

    await this.saveProducts(products);
    console.log("Producto añadido a la tienda");
  }

  async getProductById(productId) {
    const products = await this.getProducts();
    const product = products.find((p) => p.id === productId);
    return product || null;
  }

  async deleteProduct(productId) {
    const products = await this.getProducts();
    const productIndex = products.findIndex((p) => p.id === productId);

    if (productIndex === -1) {
      console.log(`Error: el producto con ID ${productId} no existe.`);
      return;
    }

    products.splice(productIndex, 1);

    await this.saveProducts(products);
    console.log(`Producto con ID ${productId} eliminado.`);
  }
}

export default ProductManager;
