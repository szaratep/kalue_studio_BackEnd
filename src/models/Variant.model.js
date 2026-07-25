import { Schema, model } from 'mongoose';

const VariantSchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'product',
        required: [true, 'La variante debe estar asociada a un producto']
    },

    color: {
        type: String,
        required: [true, 'El color de tu variante es obligatorio'],
        trim: true
    },

    colorCode: {
        type: String,
        required: [true, 'El codigo de color de tu variente es obligatorio']
    },

    size: {
        type: String,
        enum: ['S', 'M', 'L', 'XL'],
        required: [true, 'La talla de la variante es requerida']
    },

    price: {
        type: Number,
        required: [true, 'El precio es obligatorio'],
        min: [0, 'El precio no puede ser negativo']
    },

    stock: {
        type: Number,
        required: [true, 'El stock es obligatorio'],
        min: [0, 'El estock no puede ser menor a 0']
    },

    sku: {
        type: String,
        required: [true, 'El sku de la variante es obligatorio'],
        unique: [true, 'El sku del producto debe de ser unico'],
        trim: true
    }

},{
    versionKey: false,
    timestamps: true
});

const VariantModel = model('variant', VariantSchema);

export default VariantModel;