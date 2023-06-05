// ProductManager: >>

// El getProducts si hay un error devuelve una lista vacia. Pero si hay un error no deberiamos devolver nada. >> corregido

// El updateProduct no controla que el updateProduct tenga los campos distintos de null, undefined o "" pero sobre todo,  no válidas que el updateProduct tenga o no el campo ID y no queremos que nos venga de afuera. >> corregido

// El status del producto es por defecto true pero puede no serlo. >> corregido

// La lógica con la que calculas el ID es complicada y poco intuitiva. Una variable privada es mucho más simple y se alinea más con lo visto en el curso. >> corregido

import fs from "fs";
import { nanoid } from "nanoid"; // importo libreria para gestionar los id de manera automatica y sin repetirse.

class ProductManager {
  #route = "./src/models/products.json";

  constructor() {
    this.filePath = this.#route;
    this.createProductsFileIfNotExists();
  }

  // Validacion de archivo products.json, si no esta lo crea.
  createProductsFileIfNotExists() {
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, "[]");
    }
  }

  // Funciones auxiliares

  async readProducts() {
    try {
      const product = await fs.promises.readFile(this.filePath, "utf-8");
      return JSON.parse(product);
    } catch (error) {
      console.error("Error reading products:", error);
      throw new Error("Error reading products");
    }
  }

  async writeProducts(product) {
    try {
      await fs.promises.writeFile(this.filePath, JSON.stringify(product));
    } catch (error) {
      console.error("Error writing products:", error);
      throw new Error("Error writing products");
    }
  }

  async existProduct(id) {
    const products = await this.readProducts();
    return products.find((product) => product.id == id);
  }

  async existProductByCode(code) {
    const products = await this.readProducts();
    return products.find((product) => product.code === code);
  }

  // Funciones principales de productos

  async addProducts(product) {
    const { code } = product;

    const requiredFields = [
      "title",
      "description",
      "price",
      "thumbnails",
      "code",
      "stock",
      "status",
      "category",
    ];

    const missingFields = requiredFields.filter((field) => !(field in product));

    if (missingFields.length > 0) {
      return {
        message: `Missing required fields: ${missingFields.join(", ")}`,
      };
    }

    const existingProduct = await this.existProductByCode(code);

    if (existingProduct) {
      return { message: "Product code already exists" };
    }

    const oldProducts = await this.readProducts();
    product.id = nanoid();
    const allProducts = [...oldProducts, product];
    await this.writeProducts(allProducts);
    return "Product added";
  }

  async getProducts() {
    try {
      const products = await this.readProducts();
      return products;
    } catch (error) {
      console.error("Error getting products:", error);
      throw new Error("Error getting products");
    }
  }

  async getProductById(id) {
    try {
      const productById = await this.existProduct(id);
      if (!productById) return "Product not found";
      return productById;
    } catch (error) {
      console.error("Error getting product by ID:", error);
      throw new Error("Error getting product by ID");
    }
  }

  async updateProducts(id, updatedProduct) {
    try {
      const product = await this.existProduct(id);
      if (!product) return "Product not found";
      await this.deleteProducts(id);
      const oldProducts = await this.readProducts();
      const products = [{ ...updatedProduct, id: id }, ...oldProducts];
      await this.writeProducts(products);
      return "Product updated";
    } catch (error) {
      console.error("Error updating product:", error);
      throw new Error("Error updating product");
    }
  }

  async deleteProducts(id) {
    try {
      const products = await this.readProducts();
      const existProduct = products.some((prod) => prod.id === id);
      if (existProduct) {
        const filteredProducts = products.filter((prod) => prod.id !== id);
        await this.writeProducts(filteredProducts);
        return "The product has been removed";
      }
      return  "The product you want to delete doesn't exist";
    } catch (error) {
      console.error("Error deleting product:", error);
      throw new Error("Error deleting product");
    }
  }
}

export default ProductManager;
