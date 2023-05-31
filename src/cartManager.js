// CartManager.js
import fs from "fs/promises";

class CartManager {
  constructor(filePath) {
    this.filePath = filePath;
  }

  async getCarts() {
    try {
      const data = await fs.readFile(this.filePath, "utf8");
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  async getCartById(cartId) {
    const carts = await this.getCarts();
    return (
      carts.find((cart) => cart.id.toString() === cartId.toString()) || null
    );
  }

  async addCart(cart) {
    const carts = await this.getCarts();
    const generatedId = await this.generateCartId();
    cart.id = generatedId;
    carts.push(cart);
    await this.saveCarts(carts);
  }

  async updateCart(cartId, productId, quantity) {
    const carts = await this.getCarts();
    const cartIndex = carts.findIndex(
      (cart) => cart.id.toString() === cartId.toString()
    );

    if (cartIndex !== -1) {
      const cart = carts[cartIndex];
      const productIndex = cart.products.findIndex(
        (p) => p.product === productId
      );

      if (productIndex !== -1) {
        cart.products[productIndex].quantity += quantity;
      } else {
        cart.products.push({ product: productId, quantity });
      }

      await this.saveCarts(carts);
    }
  }

  async saveCarts(carts) {
    await fs.writeFile(this.filePath, JSON.stringify(carts, null, 2), "utf8");
  }

  async generateCartId() {
    const carts = await this.getCarts();
    const maxId = carts.reduce((max, cart) => Math.max(max, cart.id || 0), 0);
    return maxId + 1;
  }
}

export default CartManager;
