import fs from "fs";
import { nanoid } from "nanoid";

class ProductManager {
  constructor(filePath) {
    this.filePath = filePath || "./src/models/products.json";
    this.createProductsFileIfNotExists();
  }

  // Validación de archivo products.json, si no existe lo crea.
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
    try {
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

      const missingFields = requiredFields.filter(
        (field) => !(field in product)
      );

      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
      }

      const existingProduct = await this.existProductByCode(code);

      if (existingProduct) {
        throw new Error("Product code already exists");
      }

      const oldProducts = await this.readProducts();
      product.id = nanoid();
      const allProducts = [...oldProducts, product];
      await this.writeProducts(allProducts);
      return product;
    } catch (error) {
      console.error("Error adding product:", error);
      throw new Error("Error adding product");
    }
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
      return productById;
    } catch (error) {
      console.error("Error getting product by ID:", error);
      throw new Error("Error getting product by ID");
    }
  }

  async updateProducts(id, updatedProduct) {
    try {
      const productIndex = await this.getProductIndex(id);
      if (productIndex === -1) {
        throw new Error("Product not found");
      }

      const oldProducts = await this.readProducts();
      oldProducts[productIndex] = { ...updatedProduct, id: id };

      await this.writeProducts(oldProducts);
      return updatedProduct;
    } catch (error) {
      console.error("Error updating product:", error);
      throw new Error("Error updating product");
    }
  }

  async getProductIndex(id) {
    const products = await this.readProducts();
    return products.findIndex((product) => product.id === id);
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
      return "The product you want to delete doesn't exist";
    } catch (error) {
      console.error("Error deleting product:", error);
      throw new Error("Error deleting product");
    }
  }
}

export default ProductManager;
