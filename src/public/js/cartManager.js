import { cartModel } from '../../models/cart.model.js';
import { ProductManager } from './ProductManager.js';


export class CartManager{
    constructor() {
        this.id;
    }

    async getCarts() {
        try {
            const cart = await cartModel.find();
            return cart;
        } catch (error) {
            console.log('Error al obtener el carrito:', error);
            return [];
        }
    }

    async getCartById(id) {
        try {
            const cart = await cartModel.findById(id);
            return cart;
        } catch (error) {
            console.log('Error al obtener el carrito:', error);
            return null;
        }
    }

    async createCart() {
        try {
            const newCart = new cartModel({
                productsQuantity: 0,
                productsPrice: 0,
                products: []
            });
            await newCart.save();
        } catch (error) {
            console.log('Error al crear el carrito:', error);
        }
    }

    async addProductInCart(cid,pid) {
        const product = new ProductManager();
        const p = await product.getProductById(pid);
        try {
            const cart = await cartModel.findOneAndUpdate(
                { _id: cid },
                {
                    $push: {
                        products: {
                            product: p,
                            name:p.tittle,
                            quantity: 1
                        }
                    },
                    $inc: {
                        productsQuantity: 1,
                        productsPrice: p.price
                    }
                },
                { new: true }
            );
        } catch (error) {
            console.log('Error al agregar el producto al carrito:', error);
        }
    }

    async updateCart(id, producto) {
        try {
            const cart = await cartModel.findOneAndUpdate(
                { id: id, 'products.product': producto.id },
                { $inc: { 'products.$.quantity': 1 } },
                { new: true }
            );
            if (!cart) {
                await cartModel.findOneAndUpdate(
                    { id: id },
                    {
                        $push: {
                            products: {
                                product: producto.id,
                                quantity: 1
                            }
                        }
                    }
                );
            }
        } catch (error) {
            console.log('Error al actualizar el carrito:', error);
        }
    }
}
