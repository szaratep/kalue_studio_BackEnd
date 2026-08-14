import { encryptedPassword } from "../helpers/bcrypt.helper.js";
import { dbCreateContact } from "../service/contact.service.js";
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
        const id = req.params.id;
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

        if (!inputData.password) {
            throw new Error('Se olvidó pasar la propiedad password');
        }

        const hashedPassword = encryptedPassword(inputData.password);

        if (!hashedPassword) {
            throw new Error('No se pudo procesar la contraseña');
        }

        inputData.password = hashedPassword;

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

        if (error.message.includes('No se pudo procesar la contraseña')) {
            return res.status(500).json({
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

async function createUserPublic(req, res) {
    try {
        const inputData = req.body;

        if (!inputData.password) {
            throw new Error('Se olvidó pasar la propiedad password');
        }

        const hashedPassword = encryptedPassword(inputData.password);

        if (!hashedPassword) {
            throw new Error('No se pudo procesar la contraseña');
        }

        inputData.password = hashedPassword;

        const data = await dbCreateUser(inputData);

        if(!inputData.contacts){
            throw new Error('Se olvido pasar la informacion de contacto');
        }

        const contact = inputData.contacts;

        contact.userId = data._id;

        const dataContact = await dbCreateContact(contact);

        if(!dataContact){
            throw new Error('No se ha logrado registrar el primer contacto');
        }


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

        if (error.message.includes('No se pudo procesar la contraseña')) {
            return res.status(500).json({
                msg: error.message
            });
        }

        if (error.message.includes('Se olvido pasar la informacion de contacto')) {
            return res.status(500).json({
                msg: error.message
            });
        }

        if (error.message.includes('No se ha logrado registrar el primer contacto')) {
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

async function getUserByIdPublic(req, res) {
    try {
        const id = req.payload._id;
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

async function updateUserSelf(req, res) {
    try {
        // El id siempre sale del usuario autenticado, nunca de los parámetros de la URL,
        // así se evita que un usuario edite a otro usuario distinto de sí mismo.
        const id = req.payload._id;
        const inputData = req.body;
 
        // Campos que un usuario nunca puede autoasignarse (evita escalar privilegios
        // o desactivar su propia cuenta desde este endpoint de autoedición).
        delete inputData._id;
        delete inputData.role;
        delete inputData.status;
        delete inputData.createdAt;
        delete inputData.updatedAt;
        delete inputData.contacts;
 
        const existingUser = await dbGetUserByID(id);
 
        if (!existingUser) {
            throw new Error('El usuario que deseas actualizar no existe en el sistema');
        }
 
        // Si el body trae una contraseña nueva, se hashea antes de guardarla.
        if (inputData.password) {
            const hashedPassword = encryptedPassword(inputData.password);
 
            if (!hashedPassword) {
                throw new Error('No se pudo procesar la nueva contraseña');
            }
 
            inputData.password = hashedPassword;
        } else {
            delete inputData.password;
        }
 
        await dbUpdateUser(id, inputData);
 
        // Se retorna el usuario ya saneado (sin password) y con los contactos
        // poblados, igual que en getUserByIdPublic.
        const data = await dbGetUserByID(id);
 
        res.status(200).json({
            msg: 'Se actualizó tu información exitosamente',
            data: data
        });
 
    } catch (error) {
        console.error(error);
 
        if (error.message.includes('El usuario que deseas actualizar no existe')) {
            return res.status(404).json({
                msg: error.message
            });
        }
 
        if (error.message.includes('No se pudo procesar la nueva contraseña')) {
            return res.status(500).json({
                msg: error.message
            });
        }
 
        if (error.name === 'ValidationError') {
            const errorDetails = {};
 
            Object.entries(error.errors).forEach(([field, errObj]) => {
                errorDetails[field] = errObj.message;
            });
 
            return res.status(400).json({
                msg: 'Error de validación en propiedades del usuario',
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
            msg: 'No se pudo actualizar tu información'
        });
    }
}

async function updateUser(req, res) {
    try{
        const id = req.params.id;
        const inputData = req.body;
        const {email, nickname} = inputData;

        const existingUser = await dbGetUserByID(id);

        if (!existingUser){
            throw new Error('El usuario que deseas actualizar no existe en el sistema');
        };

        if (existingUser.role === 'administrator') {
            throw new Error('Operación denegada: No está permitido modificar usuarios con rol de administrador');
        }

        // Si el body trae una contraseña nueva, se debe hashear antes de guardarla,
        // igual que se hace en createUser. Nunca se guarda en texto plano.
        if (inputData.password) {
            const hashedPassword = encryptedPassword(inputData.password);

            if (!hashedPassword) {
                throw new Error('No se pudo procesar la nueva contraseña');
            }

            inputData.password = hashedPassword;
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

        if (error.message.includes('No se pudo procesar la nueva contraseña')) {
            return res.status(500).json({
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
        const id = req.params.id;

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
    createUser,
    createUserPublic,
    getUserByIdPublic,
    updateUserSelf
};