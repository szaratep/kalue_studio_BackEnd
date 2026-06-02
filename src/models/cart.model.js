import { Schema, model } from 'mongoose';

const CartSchema = new Schema({

    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },

    items: [{
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        }
    }]

},{
    versionKey: false,
    timestamps: true
});

const CartModel = model(
    'cart',
    CartSchema
);

export default CartModel;