import { Schema, model } from 'mongoose';


const ProductSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },

    description: {
        type: String,
        default: ''
    },
        
     slug: {
        type: String,
        unique: true,
        lowercase: true
    },

    category: {
        type: String,
        enum: ['Tote', 'Bandolera', 'Cartera'],
        required: true
    },

    material: {
        type: String,
        enum: ['Cuero', 'Cuerina', 'Sintético'],
        required: true
    },

    price: {
        type: Number,
        required: true,
        min: 0
    },

    stock: {
        type: Number,
        default: 1,
        min: 0
    },

    images: [{
        type: String
    }],

    isFeatured: {
        type: Boolean,
        default: false
    },

    isActive: {
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