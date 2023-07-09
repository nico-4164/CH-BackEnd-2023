import { Router } from 'express';
import { ProductManager } from '../public/js/ProductManager.js';
import { productModel } from '../models/productos.model.js';


const router = Router();
const productManager = new ProductManager();

router.get('/', async (req, res) => {
    let { price, limit } = req.query;
    try {
        const products = await productManager.getProducts(limit,price)
        res.send({ result: 'success', payload: products });
        //res.render('products',{products})
    } catch (error) {
        console.log("No se pudo conectar a mongoose: " + error);
    }
});

router.get('/category/:query', async (req, res) => {
    let query = req.params.query;
    let { price, limit } = req.query;
    try {
        const products = productManager.getProductsByCategory(limit,price,query)
        res.send({ result: 'success', payload: products });
    } catch (error) {
        console.log("No se pudo conectar a mongoose: " + error);
    }
});

router.get('/:page', async (req, res) => {
    let page = parseInt(req.params.page);

    try {
        const products = await productModel.paginate({}, { page, limit: 5, lean: true });

        products.prevLink = products.hasPrevPage ? `http://localhost:8080/api/productos/page=${products.prevPage}` : "";
        products.nextPage = products.hasNextPage ? `http://localhost:8080/api/productos/page=${products.nextPage}` : "";
        products.isValid = !(page <= 0 || page > products.totalPages);

        res.send({ result: 'success', payload: products });
    } catch (error) {
        console.log("No se pudo conectar a mongoose: " + error);
    }
});

router.post("/", async (req, res) => {
    const { tittle, description, code, price, status, stock, category } = req.body;
    if (!tittle || !description || !code || !price || !status || !stock || !category) {
        return res.send({ status: "error", error: req.body });
    }
    const result = await productManager.addProduct(tittle, description, code, price, stock, category);
    res.send({ status: "success", payload: result });
});

router.put("/:pid", async (req, res) => {
    const { pid } = req.params;
    const productToReplace = req.body;
    if (!productToReplace.tittle || !productToReplace.description || !productToReplace.code || !productToReplace.price || !productToReplace.stock || !productToReplace.category) {
        return res.send({ status: "error", error: "valores incompletos" });
    }
    await productManager.updateProduct(pid,productToReplace.tittle,productToReplace.description,productToReplace.code,productToReplace.price,productToReplace.stock,productToReplace.category) 
    res.send({ status: productManager.getMensaje(), payload: productToReplace });
});

router.delete("/:pid", async (req, res) => {
    const { pid } = req.params;
    await productManager.deleteProduct(pid);
    res.send({ status: productManager.getMensaje(), payload: result });
});

export default router;
