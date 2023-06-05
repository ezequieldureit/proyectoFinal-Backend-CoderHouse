// CartManager:

// El addCart no debería recibir un cart por parámetro porque el CartManager es el que se encarga de crear CartManager. >> corregido

// No se nos pide un updateCart sino un addProductToCart. Por ende, el quantity no nos puede llegar por parámetro por el simple hecho de que no lo sabemos, y debemos consultarlo. Ahora pensa que 2 carritos potencialmente pueden tener el mismo producto, ENTONCES NO PODEMOS DEPENDER QUE EL PRODUCTO TENGA UNA PROPIEDAD QUANTITITY, PORQUE SERIA EL MISMO PRODUCTO. El Carrito no tiene productos perse sino representaciones de estos, como puede ser:

// {
// 	id: 42
// 	quantitity; 1
// }

// O algo similar. >> corregido

// El CartManager no debe tener un mensaje generateID() dado que esto es algo privado de su funcionamiento interno y debe estar encapsulado. >> corregido

// La lógica que usas para calcular el proximoId es innecesariamente complicada. El reduce lo usamos para de un arreglo "reducirlo" a un único, otro, valor. Estas usandolo para iterar. >> corregido

// No válidas que exista o no el archivo en esa ubicación >> corregido

import fs from "fs";
import { nanoid } from "nanoid";
import ProductManager from "./productManager.js";

class CartManager {
  #route = "./src/models/carrito.json";

  constructor() {
    this.filePath = this.#route;
    this.createProductsFileIfNotExists();
    this.productManager = new ProductManager();
  }

  // Validacion de archivo carrito.json, si no esta lo crea.
  createProductsFileIfNotExists() {
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

  async existProductInCart(id) {
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
      return "Cart added";
    } catch (error) {
      console.error("Error adding cart:", error);
      throw new Error("Error adding cart");
    }
  }

  async getCartById(id) {
    try {
      const cartById = await this.existProductInCart(id);
      if (!cartById) return "Cart not found";
      return cartById;
    } catch (error) {
      console.error("Error getting cart by ID:", error);
      throw new Error("Error getting cart by ID");
    }
  }

  async addProductInCart(cartId, productId) {
    try {
      const cartById = await this.existProductInCart(cartId);
      if (!cartById) return "Cart not found";

      const productById = await this.productManager.existProduct(productId);
      if (!productById) return "Product not found";

      const cartAll = await this.readCart();
      const cartFilter = cartAll.filter((cart) => cart.id != cartId);

      if (cartById.products.some((prod) => prod.id === productId)) {
        const moreProductInCart = cartById.products.find(
          (prod) => prod.id === productId
        );
        moreProductInCart.quantity++;
      } else {
        cartById.products.push({ id: productById.id, quantity: 1 });
      }

      const cartConcat = [cartById, ...cartFilter];
      await this.writeCart(cartConcat);
      return "Product added to cart";
    } catch (error) {
      console.error("Error adding product to cart:", error);
      throw new Error("Error adding product to cart");
    }
  }
}

export default CartManager;
