import mongoose from "mongoose";
import orderModel from "../models/Order.model.js";
import ProductModel from "../models/Product.model.js";
import { dbGetRawCartByUserId, dbEmptyCartItems } from "./cart.service.js";
import { dbDecrementProductStock } from "./product.service.js";
import { TAX_RATE } from "../config/golbal.config.js";

const dbCreateOrders = async (newOrder) => {
    return await orderModel.create(newOrder)
};

// -----------------------------------------------------------------------
// Checkout: Carrito -> (pago simulado) -> Crear orden -> Guardar items ->
// Descontar stock -> Vaciar carrito.
//
// Todo el flujo corre dentro de una unica transaccion de Mongo: si CUALQUIER
// paso falla (producto inactivo, stock insuficiente, error inesperado), se
// hace rollback completo y no queda ni orden creada, ni stock descontado,
// ni carrito parcialmente vaciado.
//
// Nunca se confia en products/subtotal/total/paymentReference que venga del
// cliente: los precios y el stock se releen de la base de datos en el mismo
// instante del checkout.
// -----------------------------------------------------------------------
const dbCreateOrderFromCart = async (userId, checkoutData) => {
    const { mailingAddress, paymentMethod, notes } = checkoutData;

    const session = await mongoose.startSession();

    try {
        let createdOrder;

        await session.withTransaction(async () => {
            // 1. Leer el carrito real del usuario (nunca el que mande el cliente)
            const cart = await dbGetRawCartByUserId(userId, session);

            if (!cart || cart.items.length === 0) {
                throw new Error('Tu carrito esta vacio, no hay nada que comprar');
            }

            // 2. Releer cada producto y revalidar precio/stock/estado actuales
            const orderProducts = [];
            let subTotal = 0;

            for (const item of cart.items) {
                const product = await ProductModel.findById(item.productId).session(session);

                if (!product || !product.isActive) {
                    throw new Error(`Uno de los productos de tu carrito ya no esta disponible`);
                }

                if (product.stock < item.quantity) {
                    throw new Error(`Solo hay ${product.stock} unidades disponibles de "${product.name}"`);
                }

                orderProducts.push({
                    productID: product._id,
                    quantity: item.quantity,
                    unitPrice: product.price
                });

                subTotal += product.price * item.quantity;
            }

            // 3. Descontar stock de forma atomica (guard stock >= quantity),
            // por si el stock cambio entre la lectura anterior y este punto.
            for (const line of orderProducts) {
                const updatedProduct = await dbDecrementProductStock(line.productID, line.quantity, session);

                if (!updatedProduct) {
                    throw new Error('El stock cambio mientras procesabamos tu compra, intenta de nuevo');
                }
            }

            const tax = Number((subTotal * TAX_RATE).toFixed(2));
            const total = Number((subTotal + tax).toFixed(2));

            // 4. Simulacion de pago: se genera una referencia en el servidor
            // (nunca se acepta una que mande el cliente).
            const paymentReference = `SIM-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

            // 5. Crear la orden con los precios ya congelados
            const [order] = await orderModel.create([{
                userId,
                status: 'pagado',
                products: orderProducts,
                mailingAddress,
                subTotal,
                tax,
                total,
                paymentMethod,
                paymentStatus: 'aprobado',
                paymentReference,
                notes
            }], { session });

            // 6. Vaciar el carrito (mismo documento, items = [])
            await dbEmptyCartItems(cart._id, session);

            createdOrder = order;
        });

        return createdOrder;

    } finally {
        await session.endSession();
    }
};

const dbGetOrders = async () => {
    return await orderModel.find()
        .populate('userId', 'name nickname email')
        .populate('mailingAddress')
        .populate('products.productID', 'name price description images category');
};

const dbgetOrderByIdUser = async (userId) => {
    return await orderModel.find({ userId: userId })
        .populate('userId', 'name nickname email')
        .populate('mailingAddress')
        .populate('products.productID', 'name price description images category');
}

const dbGetOrdersById = async (orderId) => {
    return await orderModel.findOne({ _id: orderId })
        .populate('userId', 'name nickname email')
        .populate('mailingAddress')
        .populate('products.productID', 'name price description images category');
};

const dbUpdateOrders = async(orderId, inputData) => {
    return await orderModel.findByIdAndUpdate(orderId, inputData, { returnDocument: 'after', runValidators: true });
};

const dbDeleteOrders = async(orderId) => {
    return await orderModel.findByIdAndDelete(orderId);
};

export {
    dbCreateOrders,
    dbCreateOrderFromCart,
    dbGetOrders,
    dbGetOrdersById,
    dbUpdateOrders,
    dbDeleteOrders,
    dbgetOrderByIdUser
};