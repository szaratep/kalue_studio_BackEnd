import { Schema, model } from 'mongoose'

const OrderSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },

    status: {
        type: String,
        enum: ["pendiente", "pagado", "en preparacion", "enviado", "entregado", "cancelado"],
        default: "pendiente"
    },

    products: [{
        productID:{
            type: [Schema.Types.ObjectId],
            ref: 'product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        }
    }],

    mailingAddress: {
        type: Schema.Types.ObjectId,
        ref: 'contacts',
        required: true
    },

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

    paymentReference: {
        type: String,
        required: true,
        trim: true
    },

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