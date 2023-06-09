import fs from "fs";
import { nanoid } from "nanoid";

class CartManager {
  constructor(filePath) {
    this.filePath = filePath || "./src/models/carrito.json";
    this.createCartFileIfNotExists();
  }

  // Validación del archivo cart.json, si no existe lo crea.
  createCartFileIfNotExists() {
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, "[]");
    }
  }

  // Funciones auxiliares

  async readCart() {
    try {
      const cart = await fs.promises.readFile(this.filePath, "utf-8");
      return JSON.parse(cart);
    } catch (error) {
      console.error("Error reading cart:", error);
      throw new Error("Error reading cart");
    }
  }

  async writeCart(cart) {
    try {
      await fs.promises.writeFile(this.filePath, JSON.stringify(cart));
    } catch (error) {
      console.error("Error writing cart:", error);
      throw new Error("Error writing cart");
    }
  }

  async getCartById(id) {
    try {
      const cart = await this.existCartById(id);
      return cart;
    } catch (error) {
      console.error("Error getting cart by ID:", error);
      throw new Error("Error getting cart by ID");
    }
  }

  async existCartById(id) {
    const cart = await this.readCart();
    return cart.find((cartItem) => cartItem.id == id);
  }

  // Funciones principales del carrito

  async addCarts() {
    try {
      const cartOld = await this.readCart();
      const id = nanoid();
      const cartConcat = [{ id: id, products: [] }, ...cartOld];
      await this.writeCart(cartConcat);
      return cartConcat;
    } catch (error) {
      console.error("Error adding cart:", error);
      throw new Error("Error adding cart");
    }
  }

  async addProductToCart(cartId, productId) {
    try {
      const cart = await this.existCartById(cartId);
      if (!cart) return;

      const cartIndex = await this.getCartIndex(cartId);
      if (cartIndex === -1) return;

      const cartAll = await this.readCart();

      if (cart.products.some((prod) => prod.id === productId)) {
        const existingProduct = cart.products.find(
          (prod) => prod.id === productId
        );
        existingProduct.quantity++;
      } else {
        cart.products.push({ id: productId, quantity: 1 });
      }

      cartAll[cartIndex] = cart;
      await this.writeCart(cartAll);
      return cart;
    } catch (error) {
      console.error("Error adding product to cart:", error);
      throw new Error("Error adding product to cart");
    }
  }

  async getCartIndex(id) {
    const cart = await this.readCart();
    return cart.findIndex((cartItem) => cartItem.id === id);
  }

  async deleteCart(id) {
    try {
      const cartIndex = await this.getCartIndex(id);
      if (cartIndex === -1) return;

      const cartAll = await this.readCart();
      cartAll.splice(cartIndex, 1);
      await this.writeCart(cartAll);
    } catch (error) {
      console.error("Error deleting cart:", error);
      throw new Error("Error deleting cart");
    }
  }
}

export default CartManager;
