import {
    dbGetCart,
    dbGetCartById,
    dbGetOrCreateCartByUserId,
    dbDeleteCart,
    dbUpdateCartByUserId,
    dbRemoveCartItemByUserId,
    dbDeleteCartByUserId
} from '../service/cart.service.js';

// -----------------------------------------------------------------------
// Endpoints "/me": el carrito se resuelve SIEMPRE desde req.payload._id
// (el token). El cliente nunca envia ni conoce el _id de Mongo del carrito,
// por lo que la proteccion por rol (authorizationUser([ROLES.SUSCRIBER]))
// es suficiente: no existe forma de pedir el carrito de otro usuario.
// -----------------------------------------------------------------------

// Devuelve el carrito del usuario autenticado, creandolo si aun no existe.
const getMyCart = async (req, res) => {
    try {
        const userId = req.payload._id;

        const data = await dbGetOrCreateCartByUserId(userId);

        res.status(200).json({
            msg: 'Se ha obtenido tu carrito exitosamente',
            data: data
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            msg: 'No se pudo obtener tu carrito'
        });
    }
};


// Suma o resta la cantidad de un producto en tu carrito (delta positivo o negativo).
const updateMyCart = async (req, res) => {
    try {
        const userId = req.payload._id;
        const { productId, quantity } = req.body;

        if (!productId || quantity === undefined) {
            return res.status(400).json({
                msg: 'Se necesita el productId y la cantidad para actualizar el carrito'
            });
        }

        const data = await dbUpdateCartByUserId(userId, { productId, quantity });

        res.status(200).json({
            msg: 'Se actualizó tu carrito exitosamente',
            data: data
        });

    } catch (error) {
        console.error(error);

        if (error.message.includes('no existe en el sistema') || error.message.includes('unidades disponibles')) {
            return res.status(400).json({
                msg: error.message
            });
        }

        if (error.name === 'CastError') {
            return res.status(400).json({
                msg: 'El formato del ID del producto es inválido para la base de datos'
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
            msg: 'No se pudo actualizar tu carrito'
        });
    }
};


// Elimina un producto de tu carrito por completo (sin importar la cantidad que tuviera).
const removeMyCartItem = async (req, res) => {
    try {
        const userId = req.payload._id;
        const { productId } = req.params;

        const data = await dbRemoveCartItemByUserId(userId, productId);

        res.status(200).json({
            msg: 'Se eliminó el producto de tu carrito exitosamente',
            data: data
        });

    } catch (error) {
        console.error(error);

        if (error.name === 'CastError') {
            return res.status(400).json({
                msg: 'El formato del ID del producto es inválido para la base de datos'
            });
        }

        res.status(500).json({
            msg: 'No se pudo eliminar el producto de tu carrito'
        });
    }
};


// Elimina tu carrito por completo (ej. tras finalizar una compra).
const deleteMyCart = async (req, res) => {
    try {
        const userId = req.payload._id;

        const data = await dbDeleteCartByUserId(userId);

        if (!data) {
            throw new Error('No tienes un carrito registrado en el sistema');
        }

        res.status(200).json({
            msg: 'Tu carrito se eliminó exitosamente',
            data: data
        });

    } catch (error) {
        console.error(error);

        if (error.message.includes('No tienes un carrito registrado')) {
            return res.status(404).json({
                msg: error.message
            });
        }

        res.status(500).json({
            msg: 'No se pudo eliminar tu carrito'
        });
    }
};


// -----------------------------------------------------------------------
// Endpoints administrativos: por rol (ROLES.ADMIN), operan sobre cualquier
// carrito por su _id de Mongo. Herramientas de soporte/back-office.
// -----------------------------------------------------------------------

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
    getMyCart,
    updateMyCart,
    removeMyCartItem,
    deleteMyCart,
    getCart,
    getCartById,
    deleteCart
};