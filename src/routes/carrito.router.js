import { Router } from 'express'
import {cartModel} from  '../models/cart.model.js';

const router = Router()

router.get('/', async (req,res) => {
    try{
        let cart = await cartModel.find();
        res.send({result:'success', payload:cart})
    }
    catch(error){
        console.log("no se pudo conectar a mongoose: "+error);
    }
})

router.put("/:cid", async(req,res)=>{
    let {cid} = req.params;
    let product = req.body;
    let productToAdd={
        "totalItems":Number,
        "totalPrice":Number,
        "products": []
    }

    if (!product)return res.send({status:"error",error:"vavlores incompletos"})

    let cart = await cartModel.updateOne({_id:cid},productToAdd)
    res.send({status:"success",payload:cart})
})

router.post("/", async(req,res) =>{

    let product = req.body;
    let productToAdd={
        "totalItems":1,
        "totalPrice":1,
        "products": product
    };

    if (!product) return res.send({status:"error",error:req.body});
    let cart = await cartModel.create({totalItems,totalPrice,product});
    res.send({status:"success",payload:cart})
})

router.post('/:cid/product/:pid', async (req, res) => {

    const cid = req.params.cid;

    let {pid} = req.params;
    let product = await productModel.aggregate([{$match:{_id:pid}}]);
    let productToAdd={
        "totalItems":1,
        "totalPrice":1,
        "products": product
    };
    if (!product.tittle || !product.description || !product.code || !product.price || !product.stock || !product.category)
        return res.send({status:"error",error:"vavlores incompletos"})

    let cart = await cartModel.updateOne({_id:cid},productToAdd)
    res.send({status:"success",payload:cart})
})

router.delete('/carts/:cid', async (req, res) => {
    let {cid} = req.params;
    let cart = await cartModel.deleteOne({_id:cid})
    res.send({status:"success",payload:cart})
})

router.delete("/carts/:cid/products/:pid", async(req,res)=>{
    let {pid} = req.params;
    let {cid} = req.params;

    let result = await productModel.deleteOne(
        {
        _id:pid
        },
        {
         $match:{products:pid}   
        }
    )
    res.send({status:"success",payload:result})
})


export default router
