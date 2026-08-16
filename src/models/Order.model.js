import { Schema, model } from 'mongoose'

const OrderSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: [true, 'La orden debe estar asociada a un usuario']
    },

    status: {
        type: String,
        enum: ["pendiente", "pagado", "en preparacion", "enviado", "entregado", "cancelado"],
        default: "pendiente"
    },

    products: [{
        productID:{
            type: Schema.Types.ObjectId,
            ref: 'product',
            required: [true, 'La orden necesita un producto']
        },
        quantity: {
            type: Number,
            required: true,
            min: [1, 'Se necesita al menos un producto en la orden']
        },
        // Precio unitario "congelado" al momento de la compra. Se copia del
        // producto en el instante del checkout y ya no cambia aunque el
        // precio del producto cambie despues, para que la orden conserve
        // fielmente lo que el cliente realmente pago.
        unitPrice: {
            type: Number,
            required: [true, 'El precio unitario al momento de la compra es obligatorio'],
            min: [0, 'El precio unitario no puede ser negativo']
        }
    }],

    mailingAddress: {
        type: Schema.Types.ObjectId,
        ref: 'contact',
        required: [true, 'La direccion de envio es obligatoria']
    },

    subTotal: {
        type: Number,
        default: 0
    },

    tax: {
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
        required: [true, 'La referencia de pago es obligatoria'],
        trim: true
    },

    notes: {
        type: String,
        maxLength: [200, 'Las notas no pueden exeder los 200 caracteres']
    }
}, {
    versionKey: false,
    timestamps: true
});

const orderModel = model('order', OrderSchema);

export default orderModel;