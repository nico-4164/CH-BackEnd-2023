import { productModel } from '../models/productos.model.js';
import express from 'express'

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const products = await productModel.aggregate([
            { $sort: { price: 1 } }
        ])
        console.log(products);
        res.render('realTimeProducts',{products})
    } catch (error) {
        console.log("No se pudo conectar a mongoose: " + error);
    }
    //res.render('realtimeproducts',{productos})
})




export default router;