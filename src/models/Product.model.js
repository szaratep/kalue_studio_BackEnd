import { Schema, model } from 'mongoose';


const ProductSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre del producto es obligatorio'],
        trim: true,
        unique: [true, 'El nombre del producto es unico'], 
        minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
        maxlength: [50, 'El nombre no puede exceder los 50 caracteres']
    },

    description: {
        type: String,
        default: ''
    },

    category: {
        type: Schema.Types.ObjectId,
        ref: 'category',
        required: [true, 'La categoria es obligatoria']
    },

    material: {
        type: Schema.Types.ObjectId,
        ref: 'material',
        required: [true, 'El material es obligatorio']
    },

    price: {
        type: Number,
        required: [true, 'El precio del producto el obligatorio'],
        min: [0, 'El precio no puede ser negativo']
    },

    stock: {
        type: Number,
        default: 1,
        min: [0, 'El stock no puede ser negativo']
    },

    // Estructura para el arreglo de imágenes con validadores y mensajes de error personalizados
    images: {
        type: [{
            url: {
                type: String,
                required: [true, 'La URL de la imagen es obligatoria']
            },
            isMain: {
                type: Boolean,
                default: false
            }
        }],
        validate: [
            {
                validator: function (val) {
                    // Restricción máxima de 9 imágenes (permite 0 imágenes al eliminar todas)
                    return Array.isArray(val) && val.length <= 9;
                },
                message: 'No se pueden asociar más de nueve (9) imágenes a un producto'
            }
        ]
    },

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
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual: permite obtener las variantes (color/talla/sku) de este producto
// sin duplicar stock/precio a nivel de Product.
ProductSchema.virtual('variants', {
    ref: 'variant',
    localField: '_id',
    foreignField: 'productId'
});

const ProductModel = model('product', ProductSchema);

export default ProductModel;