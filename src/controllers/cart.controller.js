import { insertCart, dbGetCart, dbGetCartById, dbDeleteCart, dbUpdateCart } from '../service/cart.service.js';

const getCart = async (req, res) => {
    try {
        const data = await dbGetCart();

        if (data.length === 0) {
            throw new Error('No se encontraron carritos registrados en el sistema');
        }

        res.status(200).json({
            msg: 'Se han listado los carritos exitosamente',
            data: data
        });

    } catch (error) {
        console.error(error);

        if (error.message.includes('No se encontraron carritos registrados en el sistema')) {
            return res.status(404).json({
                msg: error.message
            });
        }

        res.status(500).json({
            msg: 'No se pudo obtener el listado de carritos'
        });
    }
};


const getCartById = async (req, res) => {
    try {
        const id = req.params.id;

        const data = await dbGetCartById(id);

        if (!data) {
            throw new Error('El carrito solicitado no existe en el sistema');
        }

        res.status(200).json({
            msg: 'Se encontró el carrito exitosamente',
            data: data
        });

    } catch (error) {
        console.error(error);

        if (error.message.includes('El carrito solicitado no existe')) {
            return res.status(404).json({
                msg: error.message
            });
        }

        if (error.name === 'CastError') {
            return res.status(400).json({
                msg: 'El formato del ID de carrito provisto es inválido para la base de datos'
            });
        }

        res.status(500).json({
            msg: 'No se pudo obtener el carrito'
        });
    }
};


const createCart = async (req, res) => {
    try {
        const inputData = req.body;

        const userId = req.user._id;

        inputData.userId = userId;

        const data = await insertCart(inputData);

        res.status(201).json({
            msg: 'Carrito creado exitosamente',
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
                msg: 'Error de validación en propiedades del carrito',
                errors: errorDetails
            });
        }

        if (error.code === 11000) {
            const duplicatedField = Object.keys(error.keyValue)[0];

            const errorMessages = {
                usuario: 'Ya existe un carrito registrado para este usuario'
            };

            return res.status(400).json({
                msg: errorMessages[duplicatedField] || 'Ya existe un registro con algunos de estos valores únicos'
            });
        }

        res.status(500).json({
            msg: 'No se pudo crear el carrito'
        });
    }
};


const updateCart = async (req, res) => {
    try {
        const id = req.params.id;
        const { productId, quantity } = req.body;

        if (!productId || quantity === undefined) {
            return res.status(400).json({
                msg: 'Se necesita el productId y la cantidad para actualizar el carrito'
            });
        }

        const existingCart = await dbGetCartById(id);

        if (!existingCart) {
            throw new Error('El carrito que deseas actualizar no existe en el sistema');
        }

        const data = await dbUpdateCart(id, { productId, quantity });

        res.status(200).json({
            msg: 'Se actualizó el carrito exitosamente',
            data: data
        });

    } catch (error) {
        console.error(error);

        if (error.message.includes('El carrito que deseas actualizar no existe')) {
            return res.status(404).json({
                msg: error.message
            });
        }

        if (error.name === 'CastError') {
            return res.status(400).json({
                msg: 'El formato del ID de carrito o del producto es inválido para la base de datos'
            });
        }

        if (error.name === 'ValidationError') {
            const errorDetails = {};

            Object.entries(error.errors).forEach(([field, errObj]) => {
                errorDetails[field] = errObj.message;
            });

            return res.status(400).json({
                msg: 'Error de validación en propiedades del carrito',
                errors: errorDetails
            });
        }

        res.status(500).json({
            msg: 'No se pudo actualizar el carrito'
        });
    }
};


const deleteCart = async (req, res) => {
    try {
        const id = req.params.id;

        const existingCart = await dbGetCartById(id);

        if (!existingCart) {
            throw new Error('El carrito que deseas eliminar no existe en el sistema');
        }

        const data = await dbDeleteCart(id);

        res.status(200).json({
            msg: 'El carrito se eliminó exitosamente',
            data: data
        });

    } catch (error) {
        console.error(error);

        if (error.message.includes('El carrito que deseas eliminar no existe')) {
            return res.status(404).json({
                msg: error.message
            });
        }

        if (error.name === 'CastError') {
            return res.status(400).json({
                msg: 'El formato del ID de carrito provisto es inválido para la base de datos'
            });
        }

        res.status(500).json({
            msg: 'No se pudo eliminar el carrito'
        });
    }
};


export {
    getCart,
    getCartById,
    createCart,
    updateCart,
    deleteCart
};