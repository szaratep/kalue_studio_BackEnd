import { dbDeleteProduct, dbGetProduct, dbGetProductById, dbUpdateProduct, insertProduct } from "../service/product.service.js";

const getProduct = async (req, res) => {
    try {
        const data = await dbGetProduct();

        if (data.length === 0) {
            throw new Error('No se encontraron productos registrados en el sistema');
        }

        res.status(200).json({
            msg: 'Se han listado los productos exitosamente',
            data: data
        });

    } catch (error) {
        console.error(error);

        if (error.message.includes('No se encontraron productos registrados en el sistema')) {
            return res.status(404).json({
                msg: error.message
            });
        }

        res.status(500).json({
            msg: 'No se pudo obtener el listado de productos'
        });
    }
};


const getProductById = async (req, res) => {
    try {
        const id = req.params.id;

        const data = await dbGetProductById(id);

        if (!data) {
            throw new Error('El producto solicitado no existe en el sistema');
        }

        res.status(200).json({
            msg: 'Se encontró el producto exitosamente',
            data: data
        });

    } catch (error) {
        console.error(error);

        if (error.message.includes('El producto solicitado no existe')) {
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
            msg: 'No se pudo obtener el producto'
        });
    }
};


const createProduct = async (req, res) => {
    try {
        const inputData = req.body;

        const data = await insertProduct(inputData);

        res.status(201).json({
            msg: 'Producto registrado exitosamente',
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
            msg: 'No se pudo registrar el producto'
        });
    }
};


const updateProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const inputData = req.body;

        const existingProduct = await dbGetProductById(id);

        if (!existingProduct) {
            throw new Error('El producto que deseas actualizar no existe en el sistema');
        }

        const data = await dbUpdateProduct(id, inputData);

        res.status(200).json({
            msg: 'Se actualizó el producto exitosamente',
            data: data
        });

    } catch (error) {
        console.error(error);

        if (error.message.includes('El producto que deseas actualizar no existe')) {
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
            msg: 'No se pudo actualizar el producto'
        });
    }
};


const deleteProduct = async (req, res) => {
    try {
        const id = req.params.id;

        const existingProduct = await dbGetProductById(id);

        if (!existingProduct) {
            throw new Error('El producto que deseas eliminar no existe en el sistema');
        }

        const data = await dbDeleteProduct(id);

        res.status(200).json({
            msg: 'El producto se eliminó exitosamente',
            data: data
        });

    } catch (error) {
        console.error(error);

        if (error.message.includes('El producto que deseas eliminar no existe')) {
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
            msg: 'No se pudo eliminar el producto'
        });
    }
};


export {
    getProduct,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};