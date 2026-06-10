import { dbCreateOrders, dbDeleteOrders, dbGetOrders, dbGetOrdersById, dbUpdateOrders } from '../service/order.service.js';

async function getOrder(req, res) {
    try {
        const data = await dbGetOrders();

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
        const id = req.params.idOrder;

        const data = await dbGetOrdersById(id);

        if (!data) {
            throw new Error('La orden solicitada no existe en el sistema');
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


async function createOrder(req, res) {
    try {
        const inputData = req.body;

        const data = await dbCreateOrders(inputData);

        res.status(201).json({
            msg: 'Orden creada exitosamente',
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
            msg: 'No se pudo crear la orden'
        });
    }
}


async function updateOrder(req, res) {
    try {
        const id = req.params.idOrder;
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
        const id = req.params.idOrder;

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