import { dbCreateContact, dbDeleteContact, dbGetContact, dbGetContactById, dbUpdateContact } from "../service/contact.service.js";

async function getContact(req, res) {
    try {
        const data = await dbGetContact();

        if (data.length === 0) {
            throw new Error('No se encontraron contactos registrados en el sistema');
        }

        res.status(200).json({
            msg: 'Se han listado los contactos exitosamente',
            data: data
        });

    } catch (error) {
        console.error(error);

        if (error.message.includes('No se encontraron contactos registrados en el sistema')) {
            return res.status(404).json({
                msg: error.message
            });
        }

        res.status(500).json({
            msg: 'No se pudo obtener el listado de contactos'
        });
    }
}


async function getContactById(req, res) {
    try {
        const id = req.params.idContact;

        const data = await dbGetContactById(id);

        if (!data) {
            throw new Error('El contacto solicitado no existe en el sistema');
        }

        res.status(200).json({
            msg: 'Se encontró el contacto exitosamente',
            data: data
        });

    } catch (error) {
        console.error(error);

        if (error.message.includes('El contacto solicitado no existe')) {
            return res.status(404).json({
                msg: error.message
            });
        }

        if (error.name === 'CastError') {
            return res.status(400).json({
                msg: 'El formato del ID de contacto provisto es inválido para la base de datos'
            });
        }

        res.status(500).json({
            msg: 'No se pudo obtener el contacto'
        });
    }
}


async function createContact(req, res) {
    try {
        const inputData = req.body;

        const data = await dbCreateContact(inputData);

        res.status(201).json({
            msg: 'Contacto creado exitosamente',
            data: data
        });

    } catch (error) {
        console.error(error);

        if (error.name === 'ValidationError') {
            const errorDetails = {};

            Object.entries(error.errors).forEach(([field, errObj]) => {
                errorDetails[field] = errObj.message;
            });

            return res.status(400).json({
                msg: 'Error de validación en propiedades del contacto',
                errors: errorDetails
            });
        }

        if (error.code === 11000) {
            const duplicatedField = Object.keys(error.keyValue)[0];

            const errorMessages = {
                email: 'El correo electrónico ya se encuentra registrado por otro contacto',
                telefono: 'El teléfono ya se encuentra registrado por otro contacto'
            };

            return res.status(400).json({
                msg: errorMessages[duplicatedField] || 'Ya existe un registro con algunos de estos valores únicos'
            });
        }

        res.status(500).json({
            msg: 'No se pudo crear el contacto'
        });
    }
}


async function updateContact(req, res) {
    try {
        const id = req.params.idContact;
        const inputData = req.body;

        const existingContact = await dbGetContactById(id);

        if (!existingContact) {
            throw new Error('El contacto que deseas actualizar no existe en el sistema');
        }

        const data = await dbUpdateContact(id, inputData);

        res.status(200).json({
            msg: 'Se actualizó el contacto exitosamente',
            data: data
        });

    } catch (error) {
        console.error(error);

        if (error.message.includes('El contacto que deseas actualizar no existe')) {
            return res.status(404).json({
                msg: error.message
            });
        }

        if (error.name === 'CastError') {
            return res.status(400).json({
                msg: 'El formato del ID de contacto provisto es inválido para la base de datos'
            });
        }

        if (error.name === 'ValidationError') {
            const errorDetails = {};

            Object.entries(error.errors).forEach(([field, errObj]) => {
                errorDetails[field] = errObj.message;
            });

            return res.status(400).json({
                msg: 'Error de validación en propiedades del contacto',
                errors: errorDetails
            });
        }

        if (error.code === 11000) {
            const duplicatedField = Object.keys(error.keyValue)[0];

            const errorMessages = {
                email: 'El correo electrónico ya se encuentra registrado por otro contacto',
                telefono: 'El teléfono ya se encuentra registrado por otro contacto'
            };

            return res.status(400).json({
                msg: errorMessages[duplicatedField] || 'Ya existe un registro con algunos de estos valores únicos'
            });
        }

        res.status(500).json({
            msg: 'No se pudo actualizar el contacto'
        });
    }
}


async function deleteContact(req, res) {
    try {
        const id = req.params.idContact;

        const existingContact = await dbGetContactById(id);

        if (!existingContact) {
            throw new Error('El contacto que deseas eliminar no existe en el sistema');
        }

        const data = await dbDeleteContact(id);

        res.status(200).json({
            msg: 'El contacto se eliminó exitosamente',
            data: data
        });

    } catch (error) {
        console.error(error);

        if (error.message.includes('El contacto que deseas eliminar no existe')) {
            return res.status(404).json({
                msg: error.message
            });
        }

        if (error.name === 'CastError') {
            return res.status(400).json({
                msg: 'El formato del ID de contacto provisto es inválido para la base de datos'
            });
        }

        res.status(500).json({
            msg: 'No se pudo eliminar el contacto'
        });
    }
}


export {
    getContact,
    getContactById,
    createContact,
    updateContact,
    deleteContact
};