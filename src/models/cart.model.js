import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'

const cartCollection = 'cart';

const carttSchema =  new mongoose.Schema({
    "productsQuantity":Number,
    "productsPrice":Number,
    "products": [{
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'products'
        },
        productName:{
          type: String
        },
        quantity: {
          type: Number
        }
      }]
})

carttSchema.plugin(mongoosePaginate);
export const cartModel = mongoose.model(cartCollection,carttSchema);
