import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'

const cartCollection = 'cart';

const carttSchema =  new mongoose.Schema({
    "totalItems":Number,
    "totalPrice":Number,
    "products": []
})

carttSchema.plugin(mongoosePaginate);
export const cartModel = mongoose.model(cartCollection,carttSchema);
