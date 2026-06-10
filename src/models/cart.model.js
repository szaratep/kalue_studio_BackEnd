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
            required: [true, 'El carrtio necesita un producto']
        },
        quantity: {
            type: Number,
            required: [true, 'Se nececita la cantidad de productos'],
            min: [1, 'Se necesita al menos un producto en el carrito']
        }
    }]

},{
    versionKey: false,
    timestamps: true
});

const CartModel = model('cart', CartSchema);

export default CartModel;