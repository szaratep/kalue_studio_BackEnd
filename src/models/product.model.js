import { Schema, model } from 'mongoose';


const ProductSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },

    description: {
        type: String
    },
        
    price: {
        type: Number,
        default: 0,
        min: 0
    },

    stock: {
        type: Number,


        default: 1,
        min: 1
    },

    status: {
        type: Boolean,
        default: true
    }
},{
    versionKey: false,
    timestamps: true
});


const ProductModel = model( 
    'product',         
    ProductSchema       
);


export default ProductModel;