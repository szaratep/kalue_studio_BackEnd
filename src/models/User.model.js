import { Schema, Types, model } from 'mongoose';


//Primera parte: definir el schema
const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        trim:true
    },

    lastName: {
        type: String,
        required: [true, 'El apellido es obligatorio'],
        trim: true
    },
    
    userName: {
        type: String,
        required: [true, 'El nombre de usuario es obligatorio'],
        trim:true,
        unique: true
    },

    password:{
        type: String,
        required: [true, 'La constraseña es obligatoria'],
        trim: true
    },

    role: {
        type: String,
        enum: ["admin", "vendedor", "comprador"],
        default: "comprador",
    },

    birthdate: {
        type: Date,
        required: [true, 'Tu fehca de cumpleañoss es obligatoria'],
    },

    status: {
        type: Boolean,
        default: false,
    },

    contactID: {
        type: Schema.Types.ObjectId,
        ref: 'Contacts',
        required: [true, 'Los contactos son obligatorios']
    },

},{
    versionKey: false,
    timestamps: true
});

//Segunda parte: definir el modelo
const UserModel = new model('Users', UserSchema);

export default UserModel;
