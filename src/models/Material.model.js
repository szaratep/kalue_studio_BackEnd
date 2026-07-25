import { Schema, model } from 'mongoose';

const MaterialSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre del material es obligatorio'],
        trim: true,
        unique: [true, 'El nombre del material ya existe'],
        minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
        maxlength: [30, 'El nombre no puede exceder los 30 caracteres']
    },

    description: {
        type: String,
        trim: true,
        default: '',
        maxlength: [200, 'La descripción no puede exceder los 200 caracteres']
    },

    isActive: {
        type: Boolean,
        default: true
    }
}, {
    versionKey: false,
    timestamps: true
});

const MaterialModel = model('material', MaterialSchema);

export default MaterialModel;