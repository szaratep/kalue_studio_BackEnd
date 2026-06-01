import { Schema, model } from 'mongoose';

const CartSchema = new Schema({

    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },

    items: [{
        type: Object
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