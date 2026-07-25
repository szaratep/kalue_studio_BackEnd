import { dbCreateCategory, dbDeleteCategory, dbGetCategory, dbGetCategoryByid, dbUpdateCategory } from "../service/category.service.js";


const getCategory = async (req, res) => {
    try {
        const data = await dbGetCategory();

        if (data.length === 0) {
            throw new Error('No se encontraron Categorias registradas en el sistema')
        }

        res.status(200).json({
            msg: 'Se han listado las categorias exitosamente',
            data
        });
    } catch (error) {

        console.error(error);

        if (error.message.includes('No se encontraron Categorias registradas en el sistema')) {
            return res.status(404).json({
                msg: error.message
            });
        }

        res.status(500).json({
            msg: 'No se ha logrado listar'
        })

    }
}

const getCategoryById = async (req, res) => {
    try {
        const id = req.params.id;

        const data = await dbGetCategoryByid(id);

        if (!data) {
            throw new Error('La categoria solicitada no existe')
        }

        res.status(200).json({
            msg: 'Se ha encontrado la categoria exitosamente',
            data
        })

    } catch (error) {

        console.error(error);

        if (error.message.includes('La categoria solicitada no existe')) {
            return res.status(404).json({
                msg: error.message
            });
        }

        if (error.name === 'CastError') {
            return res.status(400).json({
                msg: 'El formato del ID de producto provisto es inválido para la base de datos'
            });
        }

        res.status(500).json({
            msg: 'No se ha logrado obtener la categoria'
        })
    }
}

const createCategory = async (req, res) => {
    try {

        const inputData = req.body;

        const data = await dbCreateCategory(inputData);

        res.status(201).json({
            msg: 'Categoria registrada exitosamente',
            data
        })

    } catch (error) {

        console.error(error);

        if (error.name === 'ValidationError') {
            const errorDetails = {};

            Object.entries(error.errors).forEach(([field, errObj]) => {
                errorDetails[field] = errObj.message;
            });

            return res.status(400).json({
                msg: `Error de validacion en propiedades de la categoria`,
                errors: errorDetails
            });
        }

        if (error.code === 11000) {
            const duplicatedField = Object.keys(error.keyValue)[0];

            const errorMessages = {
                name: 'El nombre ya esta registrado en la base de datos',
            };

            return res.status(400).json({
                msg: errorMessages[duplicatedField] || 'Ya existe un registro con algunos de estos valores únicos'
            });
        }

        res.status(500).json({
            msg: 'No se ha logrado registrar el producto'
        })
    }
}

const updateCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const inputData = req.body;

        const existingCategory = await dbGetCategoryByid(id);

        if (!existingCategory) {
            throw new Error('La categoria que deseas actualizar no exite en el sistema')
        }

        const data = await dbUpdateCategory(id, inputData)

        res.status(200).json({
            msg: 'La categoria se ha actualizado con exito',
            data
        })

    } catch (error) {
        console.error(error);

        if (error.message.includes('La categoria que deseas actualizar no exite en el sistema')) {
            return res.status(404).json({
                msg: error.message
            });
        }

        if (error.name === 'CastError') {
            return res.status(400).json({
                msg: 'El formato del ID de producto provisto es inválido para la base de datos'
            });
        }

        if (error.name === 'ValidationError') {
            const errorDetails = {};

            Object.entries(error.errors).forEach(([field, errObj]) => {
                errorDetails[field] = errObj.message;
            });

            return res.status(400).json({
                msg: 'Error de validación en propiedades del producto',
                errors: errorDetails
            });
        }

        if (error.code === 11000) {
            const duplicatedField = Object.keys(error.keyValue)[0];

            const errorMessages = {
                nombre: 'El nombre del producto ya se encuentra registrado',
                sku: 'El SKU ya se encuentra en uso por otro producto'
            };

            return res.status(400).json({
                msg: errorMessages[duplicatedField] || 'Ya existe un registro con algunos de estos valores únicos'
            });
        }

        res.status(500).json({
            msg: 'No se ha logrado actualizar la categoria'
        })
    }
}

const deleteCategory = async (req, res) => {
    try{
        const id = req.params.id;

        const existingCategory = await dbGetCategoryByid( id );

        if ( !existingCategory ){
            throw new Error('La categoria que deseas eliminar no existe')
        }

        const data = await dbDeleteCategory(id);
        
        res.status(200).json({
            msg: 'La categoria se ha eliminado con exito',
            data
        })

    }catch(error){
        console.error(error);

        if (error.message.includes('La categoria que deseas eliminar no existe')) {
            return res.status(404).json({
                msg: error.message
            });
        }

        if (error.name === 'CastError') {
            return res.status(400).json({
                msg: 'El formato del ID de categoria provisto es inválido para la base de datos'
            });
        }

        res.status(500).json({
            msg: 'No se ha logrado eliminar la categoria'
        })
    }
}

export {
    getCategory,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
}