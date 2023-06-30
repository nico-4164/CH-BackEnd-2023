import { Router } from 'express'
import { productModel } from '../models/productos.model.js';

const router = Router()

router.get('/', async (req,res) => {

    let {price,limit} = req.query;

    price=parseInt(price);limit=parseInt(limit);

    limit = !limit ? 10 : limit;
    price = !price ? 1 : price;

    try{
        let products = await productModel.aggregate([
            {
                $limit:limit
            },
            {
                $sort:{price:price}
            }
        ])
        // Configuración de Handlebars como el motor de plantillas
        //res.render('products',{products});
        res.send({result:'success', payload:products})
    }
    catch(error){
        console.log("no se pudo conectar a mongoose: "+error);
    }
})

router.get('/category/:query', async (req,res) => {

    let query = req.params.query;
    let {price,limit} = req.query;

    price=parseInt(price);limit=parseInt(limit);

    limit = !limit ? 10 : limit;
    price = !price ? 1 : price;

    try{
        let products = await productModel.aggregate([
            {
                $match:{category:query}
            },
            {
                $limit:limit
            },
            {
                $sort:{price:price}
            }
        ])
        res.send({result:'success', payload:products})
    }
    catch(error){
        console.log("no se pudo conectar a mongoose: "+error);
    }
})
router.get('/:page', async (req,res) => {
    let page = parseInt(req.params.page)
    price = !price ? 1 : price;
    try{
        let products = await productModel.paginate({},{page,limit:5,lean:true})
        products.prevLink = result.hasPrevPage?'http://localhost:8080/api/productos/page=${products.prevPage}':"";
        products.nextPage = result.hasNextPage?'http://localhost:8080/api/productos/page=${products.nextPage}':"";
        products.isValid = !(page<=0 || page > products.totalPages)
        res.send({result:'success', payload:products})
    }
    catch(error){
        console.log("no se pudo conectar a mongoose: "+error);
    }
})

router.post("/", async(req,res) =>{

    let {tittle,description,code,price,status,stock,category} = req.body;
    
    if (!tittle || !description || !code || !price || !status || !stock || !category) return res.send({status:"error",error:req.body});
    let result = await productModel.create({tittle,description,code,status,stock,category});
    res.send({status:"success",payload:result})
})

router.put("/:pid", async(req,res)=>{
    let {pid} = req.params;
    let productToReplace = req.body;

    if (!productToReplace.tittle || !productToReplace.description || !productToReplace.code || !productToReplace.price || !productToReplace.stock || !productToReplace.category)
        return res.send({status:"error",error:"vavlores incompletos"})
    let result = await productModel.updateOne({_id:pid},productToReplace)
    res.send({status:"success",payload:result})
})

router.delete("/:pid", async(req,res)=>{
    let {pid} = req.params;
    let result = await productModel.deleteOne({_id:pid})
    res.send({status:"success",payload:result})
})



export default router
