import { dbCreateMaterial, dbDeleteMaterial, dbGetMaterialById, dbGetMaterials, dbUpdateMaterial } from "../service/material.service.js";

async function getMaterial(req, res) {
    try {
        const data = await dbGetMaterials();

        if (data.length === 0){
            throw new Error('No se encontraron materiales registrados en el sistema')
        }

        res.status(200).json({
            msg: 'Se han listado los materiales exitosamente',
            data: data
        })
    } catch (error) {
        console.error(error)

        if (error.message.includes('No se encontraron materiales registrados en el sistema')) {
            return res.status(404).json({
                msg: error.message
            });
        }

        res.status(500).json({
            msg: 'No pudo obtener la lista de materiales'
        })
    }
}

async function getMaterialById(req, res) {
    try {
        const id = req.params.id;
        const data = await dbGetMaterialById(id);

        if (!data){
            throw new Error('El material solicitado no existe en el sistema')
        }

        res.status(200).json({
            msg: 'Se encontro el material exitosamente',
            data: data
        })

    } catch (error) {
        console.error(error)

        if (error.message.includes('El material solicitado no existe')) {
            return res.status(404).json({
                msg: error.message
            });
        }

        if (error.name === 'CastError') {
            return res.status(400).json({
                msg: 'El formato del ID de material provisto es inválido para la base de datos'
            });
        }

        res.status(500).json({
            msg: 'No pudo obtener el material'
        })
    }
}

async function createMaterial(req, res) {
    try {
        const inputData = req.body;

        const data = await dbCreateMaterial(inputData);

        res.status(201).json({
            msg: 'Se ha registrado el material exitosamente',
            data: data
        })
    } catch (error) {
        console.error(error);

        if (error.name === 'ValidationError') {
            const errorDetails = {};

            Object.entries(error.errors).forEach(([field, errObj]) => {
                errorDetails[field] = errObj.message;
            });

            return res.status(400).json({
                msg: `Error de validacion en propiedades del material`,
                errors: errorDetails
            });
        }

        if (error.code === 11000) {
            const duplicatedField = Object.keys(error.keyValue)[0];

            const errorMessages = {
                name: 'Ya existe un material registrado con ese nombre'
            };

            return res.status(400).json({
                msg: errorMessages[duplicatedField] || 'Ya existe un registro con algunos de estos valores únicos'
            });
        }

        res.status(500).json({
            msg: "No se logro el registro del material"
        })
    }
}

async function updateMaterial(req, res) {
    try{
        const id = req.params.id;
        const inputData = req.body;

        const existingMaterial = await dbGetMaterialById(id);

        if (!existingMaterial){
            throw new Error('El material que deseas actualizar no existe en el sistema');
        };

        const data = await dbUpdateMaterial(id, inputData);

        res.status(200).json({
            msg: 'Se actualiza el registro exitosamente',
            data: data
        })
    }catch(error){
        console.error(error);

        if (error.message.includes('El material que deseas actualizar no existe')) {
            return res.status(404).json({
                msg: error.message
            });
        }

        if (error.name === 'CastError') {
            return res.status(400).json({
                msg: 'El formato del ID de material provisto es inválido para la base de datos'
            });
        }

        if (error.name === 'ValidationError') {
            const errorDetails = {};

            Object.entries(error.errors).forEach(([field, errObj]) => {
                errorDetails[field] = errObj.message;
            });

            return res.status(400).json({
                msg: `Error de validacion en propiedades del material`,
                errors: errorDetails
            });
        }

        if (error.code === 11000) {
            const duplicatedField = Object.keys(error.keyValue)[0];

            const errorMessages = {
                name: 'Ya existe un material registrado con ese nombre'
            };

            return res.status(400).json({
                msg: errorMessages[duplicatedField] || 'Ya existe un registro con algunos de estos valores únicos'
            });
        }

        res.status(500).json({
            msg: 'No pudo actualizar el material'
        })
    }
}

async function deleteMaterial(req, res) {
    try {
        const id = req.params.id;

        const existingMaterial = await dbGetMaterialById(id);

        if (!existingMaterial){
            throw new Error('El material que deseas eliminar no existe');
        }

        const data = await dbDeleteMaterial(id);

        res.status(200).json({
            msg: 'El material se borro exitosamente',
            data: data
        })
    } catch (error) {
        console.error(error);

        if (error.message.includes('El material que deseas eliminar no existe')) {
            return res.status(404).json({
                msg: error.message
            });
        }

        if (error.name === 'CastError') {
            return res.status(400).json({
                msg: 'El formato del ID de material provisto es inválido para la base de datos'
            });
        }

        res.status(500).json({
            msg: 'No pudo borrar el material'
        })
    }
}

export {
    getMaterial,
    getMaterialById,
    createMaterial,
    updateMaterial,
    deleteMaterial
};