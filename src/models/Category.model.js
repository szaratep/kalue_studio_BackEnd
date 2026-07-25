import { Schema, model } from "mongoose";

const CategorySchema = new Schema({

    name: {
        type: String,
        required: [true, 'El nombre de la categoria es obligatorio'],
        trim: true,
        unique: true,
        minlength: [5, 'El nombre debe de tener al menos 5 caracteres'],
        maxlength: [50, 'El nombre no puede exceder los 50 caracteres']
    },

    description: {
        type: String,
        trim: true,
        maxlength: [300, 'La descripción no puede exceder los 300 caracteres'],
        default: ''
    },
    parentCategoryId: {
        type: Schema.Types.ObjectId,
        ref: 'category',
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    versionKey: false,
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

// Virtual: permite listar todos los productos que pertenecen a esta categoria
// sin duplicar la relacion (Product.category ya es la fuente de verdad).
CategorySchema.virtual('products', {
    ref: 'product',
    localField: '_id',
    foreignField: 'category'
});

const CategoryModel = model('category', CategorySchema);

export default CategoryModel;