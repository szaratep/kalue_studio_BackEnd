import { Schema, model } from 'mongoose'
import AddressesSchema from './Adresses.model.js';
import ItemSchema from './Items.model.js';

const OrderSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },

    status: {
        type: String,
        enum: ["pendiente", "pagado", "en preparacion", "enviado", "entregado", "cancelado"],
        default: "pendiente"
    },

    items: [ItemSchema],

    mailingAddress: AddressesSchema,

    subTotal: {
        type: Number,
        default: 0
    },

    discount: {
        type: Number,
        default: 0
    },

    shippingCost: {
        type: Number,
        default: 0
    },

    total: {
        type: Number,
        default: 0
    },

    paymentMethod: {
        type: String,
        enum: ["tarjeta", "pse", "contraentrega", "efectivo"],
        default: "efectivo"
    },

    paymentStatus: {
        type: String,
        enum: ["pendiente", "aprobado", "rechazado"],
        default: "pendiente"
    },

    paymentReference: String,

    notes: {
        type: String,
        maxLength: 200
    }
}, {
    versionKey: false,
    timestamps: true
});

const orderModel = new model('Orders', OrderSchema);

export default orderModel;