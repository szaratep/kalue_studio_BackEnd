import { Schema, model } from 'mongoose';

const VariantSchema = new Schema({

    color: {
        type: String,
        required: true,
        trim: true
    },

    colorCode: {
        type: String,
        required: true
    },

    size: {
        type: String,
        enum: ['S', 'M', 'L', 'XL'],
        required: true
    },

    price: {
        type: Number,
        required: true,
        min: 0
    },

    stock: {
        type: Number,
        required: true,
        min: 0
    },

    sku: {
        type: String,
        required: true,
        unique: true,
        trim: true
    }

},{
    versionKey: false,
    timestamps: true
});

const VariantModel = model(
    'variant',
    VariantSchema
);

export default VariantModel;