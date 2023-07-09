import { productModel } from '../../models/productos.model.js';

export class ProductManager {
    constructor() {
        this.mensaje = "";
    }

    async getProducts(_limit,_price) {
        _limit = parseInt(_limit) || 10;
        _price = parseInt(_price) || 1;
        try {
            const products = await productModel.aggregate([
                { $limit: _limit },
                { $sort: { price: _price } }
            ]);
            return products;
        } catch (error) {
            console.log("Error al obtener los productos:", error);
            return [];
        }
    }

    async getProductsByCategory(_limit,_price,_category) {
        _limit = parseInt(_limit) || 10;
        _price = parseInt(_price) || 1;
        try {
            const products = await productModel.aggregate([
                { $match: { category: _category } },
                { $limit: _limit },
                { $sort: { price: _price } }
            ]);
            return products;
        } catch (error) {
            console.log("Error al obtener los productos:", error);
            return [];
        }
    }

    async getProductsWithLimit(limite) {
        try {
            const products = await productModel.find().limit(limite);
            return products;
        } catch (error) {
            console.log("Error al obtener los productos:", error);
            return [];
        }
    }

    async getProductById(id) {
        try {
            const product = await productModel.findById(id);
            if (product) {
                return product;
            } else {
                return { status: "El producto que desea modificar no se encontró" };
            }
        } catch (error) {
            console.log("Error al obtener el producto:", error);
            return { status: "Ocurrió un error al obtener el producto" };
        }
    }

    async addProduct(tittle, description, code, price, stock, category) {
        if (await this.undefinValues(tittle, description, code, price, stock, category)) {
            this.mensaje = "campos invalidos";
            return;
        }

        if (await this.existeCode(code)) {
            this.mensaje = `El código ${code} es inválido para el producto ${tittle}`;
            return;
        }

        try {
            const product = await productModel.create({ tittle, description, code, status, stock, category });
            return product;
        } catch (error) {
            console.log("Error al agregar el producto:", error);
            this.mensaje = "Ocurrió un error al agregar el producto";
        }
    }

    async updateProduct(id, tittle, description, code, price, stock, status, category) {
        try {
            await productModel.findByIdAndUpdate(id, {
                tittle,
                description,
                code,
                price,
                status,
                stock,
                category
            });
            this.mensaje = "success";
        } catch (error) {
            console.log("Error al actualizar el producto:", error);
            this.mensaje = "Ocurrió un error al actualizar el producto";
        }
    }

    async deleteProduct(id) {
        try {
            await productModel.findByIdAndDelete(id);
            this.mensaje = "success";
        } catch (error) {
            console.log("Error al eliminar el producto:", error);
            this.mensaje = "Ocurrió un error al eliminar el producto";
        }
    }

    async undefinValues(tittle, description, code, price, stock, category) {
        return (
            (tittle === undefined || tittle.trim().length == 0) ||
            (description === undefined || description.trim().length == 0) ||
            (price === undefined) ||
            (code === undefined || code.trim().length == 0) ||
            (stock === undefined) ||
            (category === undefined || category.trim().length == 0)
        );
    }

    getMensaje() {
        return this.mensaje;
    }

    async existeCode(code) {
        const product = await productModel.findOne({ code: code });
        return product ? true : false;
    }

}
