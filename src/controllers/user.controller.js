import { encryptedPassword } from "../helpers/bcrypt.helper.js";
import { dbCreateUser, dbDeleteUser, dbGetUserByID, dbGetUsers, dbUpdateUser } from "../service/user.service.js";

async function getUser(req, res) {
    try {
        const data = await dbGetUsers();

        if (data.length === 0){
            throw new Error('No se encontraron usuarios registrados en el sistema')
        }

        res.status(200).json({
            msg: 'Se han listado los usuarios exitosamente',
            data: data
        })
    } catch (error) {
        console.error(error)

        if (error.message.includes('No se encontraron usuarios registrados en el sistema')) {
            return res.status(404).json({
                msg: error.message
            });
        }

        res.status(500).json({
            msg: 'No pudo obtener la lista de usuario'
        })
    }
}

async function getUserById(req, res) {
    try {
        const id = req.params.idUser;
        const data = await dbGetUserByID(id);

        if (!data){
            throw new Error('El usuario solicitado no existe en el sistema')
        }

        res.status(200).json({
            msg: 'Se encontro el usuario exitosamente',
            data: data
        })

    } catch (error) {
        console.error(error)

        if (error.message.includes('El usuario solicitado no existe')) {
            return res.status(404).json({
                msg: error.message
            });
        }

        if (error.name === 'CastError') {
            return res.status(400).json({
                msg: 'El formato del ID de usuario provisto es inválido para la base de datos'
            });
        }

        res.status(500).json({
            msg: 'No pudo obtener el usuario'
        })
    }
}

async function createUser(req, res) {
    try {
        const inputData = req.body;

        inputData.password = encryptedPassword(inputData.password);

        const data = await dbCreateUser(inputData);

        res.status(201).json({
            data: data
        })
    } catch (error) {
        console.error(error);

        if (error.message.includes('Se olvidó pasar la propiedad password')) {
            return res.status(400).json({
                msg: error.message
            });
        }

        if (error.name === 'ValidationError') {
            const errorDetails = {};

            Object.entries(error.errors).forEach(([field, errObj]) => {
                errorDetails[field] = errObj.message;
            });

            return res.status(400).json({
                msg: `Error de validacion en propiedades del producto`,
                errors: errorDetails
            });
        }

        if (error.code === 11000) {
            const duplicatedField = Object.keys(error.keyValue)[0];

            const errorMessages = {
                email: 'El correo electrónico ya se encuentra registrado por otro usuario',
                nickname: 'El nickname ya se encuentra en uso por otro usuario'
            };

            return res.status(400).json({
                msg: errorMessages[duplicatedField] || 'Ya existe un registro con algunos de estos valores únicos'
            });
        }

        res.status(500).json({
            msg: "No se logro el registro de tu usuario"
        })
    }
}

async function updateUser(req, res) {
    try{
        const id = req.params.idUser;
        const inputData = req.body;
        const {email, nickname} = inputData;

        const existingUser = await dbGetUserByID(id);

        if (!existingUser){
            throw new Error('El usuario que deseas actualizar no existe en el sistema');
        };

        if (existingUser.role === 'administrator') {
            throw new Error('Operación denegada: No está permitido modificar usuarios con rol de administrador');
        }

        const data = await dbUpdateUser(id, inputData);

        res.status(200).json({
            msg: 'Se actualiza el registro exitosamente',
            data: data
        })
    }catch(error){
        console.error(error);

        if (error.message.includes('El usuario que deseas actualizar no existe')) {
            return res.status(404).json({
                msg: error.message
            });
        }

         if (error.message.includes('No está permitido modificar usuarios con rol de administrador')) {
            return res.status(403).json({
                msg: error.message
            });
        }

        if (error.name === 'CastError') {
            return res.status(400).json({
                msg: 'El formato del ID de usuario provisto es inválido para la base de datos'
            });
        }

         if (error.code === 11000) {
            const duplicatedField = Object.keys(error.keyValue)[0];

            const errorMessages = {
                email: 'El correo electrónico ya se encuentra registrado por otro usuario',
                nickname: 'El nickname ya se encuentra en uso por otro usuario'
            };

            return res.status(400).json({
                msg: errorMessages[duplicatedField] || 'Ya existe un registro con algunos de estos valores únicos'
            });
        }

        res.status(500).json({
            msg: 'No pudo actualizar el usuario'
        })
    }
}

async function deleteUser(req, res) {
    try {
        const id = req.params.idUser;

        const existingUser = await dbGetUserByID(id);

        if (!existingUser){
            throw new Error('El usuario que deseas eliminar no existe');
        }
        
        if (existingUser.role === 'administrator'){
            throw new Error('No está permitido eliminar usuarios con rol de administrador')
        }


        const data = await dbDeleteUser(id);

        res.status(200).json({
            msg: 'El usuario se borro exitosamente',
            data: data
        })
    } catch (error) {
        console.error(error);

        if (error.message.includes('El usuario que deseas eliminar no existe')) {
            return res.status(404).json({
                msg: error.message
            });
        }

        if (error.message.includes('No está permitido eliminar usuarios con rol de administrador')) {
            return res.status(404).json({
                msg: error.message
            });
        }

        if (error.name === 'CastError') {
            return res.status(400).json({
                msg: 'El formato del ID de usuario provisto es inválido para la base de datos'
            });
        }

        res.status(500).json({
            msg: 'No pudo borar el usuario'
        })
    }
}

export {
    getUser,
    getUserById,
    updateUser,
    deleteUser,
    createUser
};