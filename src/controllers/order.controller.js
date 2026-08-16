import { dbCreateOrderFromCart, dbDeleteOrders, dbgetOrderByIdUser, dbGetOrders, dbGetOrdersById, dbUpdateOrders } from '../service/order.service.js';
import { dbGetContactById } from '../service/contact.service.js';
import { ROLES } from '../config/golbal.config.js';

async function getOrder(req, res) {
    try {
        const data = await dbgetOrderByIdUser(req.payload._id);

        if (data.length === 0) {
            throw new Error('No se encontraron órdenes registradas en el sistema');
        }

        res.status(200).json({
            msg: 'Se han listado las órdenes exitosamente',
            data: data
        });

    } catch (error) {
        console.error(error);

        if (error.message.includes('No se encontraron órdenes registradas en el sistema')) {
            return res.status(404).json({
                msg: error.message
            });
        }

        res.status(500).json({
            msg: 'No se pudo obtener el listado de órdenes'
        });
    }
}


async function getOrderById(req, res) {
    try {
        const id = req.params.id;

        const data = await dbGetOrdersById(id);

        if (!data) {
            throw new Error('La orden solicitada no existe en el sistema');
        }

        // Un suscriptor solo puede ver sus propias ordenes. Un administrador
        // puede ver cualquiera (soporte/back-office).
        const isOwner = data.userId?._id?.toString() === req.payload._id.toString();
        const isAdmin = req.payload.role === ROLES.ADMIN;

        if (!isOwner && !isAdmin) {
            throw new Error('No tienes permiso para ver esta orden');
        }

        res.status(200).json({
            msg: 'Se encontró la orden exitosamente',
            data: data
        });

    } catch (error) {
        console.error(error);

        if (error.message.includes('La orden solicitada no existe')) {
            return res.status(404).json({
                msg: error.message
            });
        }

        if (error.message.includes('No tienes permiso para ver esta orden')) {
            return res.status(403).json({
                msg: error.message
            });
        }

        if (error.name === 'CastError') {
            return res.status(400).json({
                msg: 'El formato del ID de orden provisto es inválido para la base de datos'
            });
        }

        res.status(500).json({
            msg: 'No se pudo obtener la orden'
        });
    }
}


// Checkout real: NO se confia en products/subtotal/total/paymentReference
// que venga del cliente. Solo se aceptan datos que el cliente SI controla
// legitimamente (direccion de envio, metodo de pago, notas); todo lo demas
// (items comprados, precios, stock, total, referencia de pago simulada) se
// reconstruye en el servidor a partir del carrito real del usuario.
async function createOrder(req, res) {
    try {
        const userId = req.payload._id;
        const { mailingAddress, paymentMethod, notes } = req.body;

        if (!mailingAddress) {
            return res.status(400).json({
                msg: 'Se necesita una dirección de envío para procesar tu pedido'
            });
        }

        // La direccion de envio debe existir y pertenecer al usuario que compra.
        const contact = await dbGetContactById(mailingAddress);

        if (!contact) {
            return res.status(404).json({
                msg: 'La dirección de envío seleccionada no existe'
            });
        }

        if (contact.userId.toString() !== userId.toString()) {
            return res.status(403).json({
                msg: 'No puedes usar una dirección de envío que no te pertenece'
            });
        }

        const data = await dbCreateOrderFromCart(userId, { mailingAddress, paymentMethod, notes });

        res.status(201).json({
            msg: 'Orden creada exitosamente',
            data: data
        });

    } catch (error) {
        console.error(error);

        if (error.message.includes('carrito esta vacio')) {
            return res.status(400).json({
                msg: error.message
            });
        }

        if (error.message.includes('ya no esta disponible') || error.message.includes('unidades disponibles') || error.message.includes('stock cambio')) {
            return res.status(409).json({
                msg: error.message
            });
        }

        if (error.name === 'ValidationError') {
            const errorDetails = {};

            Object.entries(error.errors).forEach(([field, errObj]) => {
                errorDetails[field] = errObj.message;
            });

            return res.status(400).json({
                msg: 'Error de validación en propiedades de la orden',
                errors: errorDetails
            });
        }

        if (error.name === 'CastError') {
            return res.status(400).json({
                msg: 'El formato de la dirección de envío es inválido'
            });
        }

        res.status(500).json({
            msg: 'No se pudo crear la orden'
        });
    }
}


async function updateOrder(req, res) {
    try {
        const id = req.params.id;
        const inputData = req.body;

        const existingOrder = await dbGetOrdersById(id);

        if (!existingOrder) {
            throw new Error('La orden que deseas actualizar no existe en el sistema');
        }

        const data = await dbUpdateOrders(id, inputData);

        res.status(200).json({
            msg: 'Se actualizó la orden exitosamente',
            data: data
        });

    } catch (error) {
        console.error(error);

        if (error.message.includes('La orden que deseas actualizar no existe')) {
            return res.status(404).json({
                msg: error.message
            });
        }

        if (error.name === 'CastError') {
            return res.status(400).json({
                msg: 'El formato del ID de orden provisto es inválido para la base de datos'
            });
        }

        if (error.name === 'ValidationError') {
            const errorDetails = {};

            Object.entries(error.errors).forEach(([field, errObj]) => {
                errorDetails[field] = errObj.message;
            });

            return res.status(400).json({
                msg: 'Error de validación en propiedades de la orden',
                errors: errorDetails
            });
        }

        if (error.code === 11000) {
            const duplicatedField = Object.keys(error.keyValue)[0];

            const errorMessages = {
                numero: 'El número de orden ya se encuentra registrado'
            };

            return res.status(400).json({
                msg: errorMessages[duplicatedField] || 'Ya existe un registro con algunos de estos valores únicos'
            });
        }

        res.status(500).json({
            msg: 'No se pudo actualizar la orden'
        });
    }
}


async function deleteOrder(req, res) {
    try {
        const id = req.params.id;

        const existingOrder = await dbGetOrdersById(id);

        if (!existingOrder) {
            throw new Error('La orden que deseas eliminar no existe en el sistema');
        }

        const data = await dbDeleteOrders(id);

        res.status(200).json({
            msg: 'La orden se eliminó exitosamente',
            data: data
        });

    } catch (error) {
        console.error(error);

        if (error.message.includes('La orden que deseas eliminar no existe')) {
            return res.status(404).json({
                msg: error.message
            });
        }

        if (error.name === 'CastError') {
            return res.status(400).json({
                msg: 'El formato del ID de orden provisto es inválido para la base de datos'
            });
        }

        res.status(500).json({
            msg: 'No se pudo eliminar la orden'
        });
    }
}


export {
    getOrder,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder
};