import { insertVariant, dbGetVariant, dbGetVariantById, dbDeleteVariant, dbUpdateVariant } from "../service/variant.service.js";

const getVariant = async (req, res) => {
    try {
        const data = await dbGetVariant();

        if (data.length === 0) {
            throw new Error('No se encontraron variantes registradas en el sistema');
        }

        res.status(200).json({
            msg: 'Se han listado las variantes exitosamente',
            data: data
        });

    } catch (error) {
        console.error(error);

        if (error.message.includes('No se encontraron variantes registradas en el sistema')) {
            return res.status(404).json({
                msg: error.message
            });
        }

        res.status(500).json({
            msg: 'No se pudo obtener el listado de variantes'
        });
    }
};


const getVariantById = async (req, res) => {
    try {
        const id = req.params.id;

        const data = await dbGetVariantById(id);

        if (!data) {
            throw new Error('La variante solicitada no existe en el sistema');
        }

        res.status(200).json({
            msg: 'Se encontró la variante exitosamente',
            data: data
        });

    } catch (error) {
        console.error(error);

        if (error.message.includes('La variante solicitada no existe')) {
            return res.status(404).json({
                msg: error.message
            });
        }

        if (error.name === 'CastError') {
            return res.status(400).json({
                msg: 'El formato del ID de variante provisto es inválido para la base de datos'
            });
        }

        res.status(500).json({
            msg: 'No se pudo obtener la variante'
        });
    }
};


const createVariant = async (req, res) => {
    try {
        const inputData = req.body;

        const data = await insertVariant(inputData);

        res.status(201).json({
            msg: 'Variante registrada exitosamente',
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
                msg: 'Error de validación en propiedades de la variante',
                errors: errorDetails
            });
        }

        if (error.code === 11000) {
            const duplicatedField = Object.keys(error.keyValue)[0];

            const errorMessages = {
                nombre: 'El nombre de la variante ya se encuentra registrado',
                sku: 'El SKU ya se encuentra en uso por otra variante'
            };

            return res.status(400).json({
                msg: errorMessages[duplicatedField] || 'Ya existe un registro con algunos de estos valores únicos'
            });
        }

        res.status(500).json({
            msg: 'No se pudo registrar la variante'
        });
    }
};


const updateVariant = async (req, res) => {
    try {
        const id = req.params.id;
        const inputData = req.body;

        const existingVariant = await dbGetVariantById(id);

        if (!existingVariant) {
            throw new Error('La variante que deseas actualizar no existe en el sistema');
        }

        const data = await dbUpdateVariant(id, inputData);

        res.status(200).json({
            msg: 'Se actualizó la variante exitosamente',
            data: data
        });

    } catch (error) {
        console.error(error);

        if (error.message.includes('La variante que deseas actualizar no existe')) {
            return res.status(404).json({
                msg: error.message
            });
        }

        if (error.name === 'CastError') {
            return res.status(400).json({
                msg: 'El formato del ID de variante provisto es inválido para la base de datos'
            });
        }

        if (error.name === 'ValidationError') {
            const errorDetails = {};

            Object.entries(error.errors).forEach(([field, errObj]) => {
                errorDetails[field] = errObj.message;
            });

            return res.status(400).json({
                msg: 'Error de validación en propiedades de la variante',
                errors: errorDetails
            });
        }

        if (error.code === 11000) {
            const duplicatedField = Object.keys(error.keyValue)[0];

            const errorMessages = {
                nombre: 'El nombre de la variante ya se encuentra registrado',
                sku: 'El SKU ya se encuentra en uso por otra variante'
            };

            return res.status(400).json({
                msg: errorMessages[duplicatedField] || 'Ya existe un registro con algunos de estos valores únicos'
            });
        }

        res.status(500).json({
            msg: 'No se pudo actualizar la variante'
        });
    }
};


const deleteVariant = async (req, res) => {
    try {
        const id = req.params.id;

        const existingVariant = await dbGetVariantById(id);

        if (!existingVariant) {
            throw new Error('La variante que deseas eliminar no existe en el sistema');
        }

        const data = await dbDeleteVariant(id);

        res.status(200).json({
            msg: 'La variante se eliminó exitosamente',
            data: data
        });

    } catch (error) {
        console.error(error);

        if (error.message.includes('La variante que deseas eliminar no existe')) {
            return res.status(404).json({
                msg: error.message
            });
        }

        if (error.name === 'CastError') {
            return res.status(400).json({
                msg: 'El formato del ID de variante provisto es inválido para la base de datos'
            });
        }

        res.status(500).json({
            msg: 'No se pudo eliminar la variante'
        });
    }
};


export {
    getVariant,
    getVariantById,
    createVariant,
    updateVariant,
    deleteVariant
};