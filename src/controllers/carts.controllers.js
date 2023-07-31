import Controllers from "./class.controllers.js";
import CartService from "../services/carts.services.js";
import ProductService from "../services/product.services.js";
import TicketServices from "../services/ticket.services.js";
import { createResponse } from "../utils.js";


const cartService = new CartService();
const productService = new ProductService();
const ticketService = new TicketServices();

export default class CartController extends Controllers {
  constructor(){
      super(cartService)
  }

  getCart = async (req, res, next) => {
    try {
      const { cid } = req.params;
      const cart = await cartService.getCart (cid);
      res.json(cart);
    } catch (error) {
      next(error);
    }
  };
  
  createCart = async (req, res, next) => {
    try {
      const newCart = await cartService.createCart ();
      res.json(newCart);
    } catch (error) {
      next(error);
    }
  };
  
  addProductToCart = async (req, res, next) => {
    try {
      const cid = req.params.cid;
      const pid = req.params.pid;
      await cartService.getCart (cid);
      const prodAdded = await cartService.addProductInCart (cid, pid);
      res.json(prodAdded);
    } catch (error) {
      next(error);
    }
  };
  
  deleteProductToCart = async (req, res, next) => {
    try {
      const cid = req.params.cid;
      const pid = req.params.pid;
      const prodDelete = await cartService.deleteProductInCart (cid, pid);
      res.json(prodDelete);
    } catch (error) {
      next(error);
    }
  };
  
  deleteAllProductToCart = async (req, res, next) => {
    try {
      const cid = req.params.cid;
      const cartDelete = await cartService.deleteCart (cid);
      res.json (cartDelete);
    } catch (error) {
      next(error);
    }
  ;}
  
  updateProductToCart = async (req, res, next) => {
    try {
      const cid = req.params.cid;
      const data = {...req.body};
      const update = await cartService.updateCart (cid, data);
      res.json (update);
    } catch (error) {
      console.log (error);
      next(error);
      next(error);
    }
  }
  
  updateProductQuantity = async (req, res, next) =>{
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        const newQty = await cartService.updateProductInCart (cid, pid, quantity);
        res.json(newQty);
    } catch (error) {
        next(error);
    }
  }
  
  closeCart = async (req, res) => {
    const { cid } = req.params;
    const { user } = req.user || { user: { email: "m.a@gmail.com" } };
    let cart = await cartService.getCart(cid);
  
    if (cart.products.length > 0) {
      let amount = 0;
      let productWithoutStock = [];
      let purchaser = user?.email || "m.a@gmail.com";
  
      cart.products.forEach(async ({product, quantity}) => {
        if (product.stock >= quantity) {
          amount += product.price * quantity;
          product.stock -= quantity;
          await productService.updateProduct(product._id, product);          
        } else {
          console.log("poco stock")
          //productWithoutStock.push(product._id);
        }
      });
  
      if (amount > 0) {
        console.log('amount',amount)
        const ticketData = {
          purchase_datetime: new Date(),
          amount: amount,
          purchaser: purchaser,
        };
        const newTicket = await ticketService.createTicket(ticketData);
        if (newTicket) {
          createResponse(res, 200, newTicket)
        } else {
          return res.status(400).send({ newTicket });
        }
      } else {
        return res.send({ response: "No products available." });
      }
    } else {
      return res.send({ response: "There are no products in the cart." });
    }
  };
}

