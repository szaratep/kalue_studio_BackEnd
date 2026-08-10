import CartModel from '../models/Cart.model.js';
import ProductModel from '../models/Product.model.js';

const CART_POPULATE = { path: 'items.productId', select: 'name price images category stock isActive' };

const insertCart = async (newCart) => {
    return await CartModel.create(newCart);
}

const dbGetCart = async () => {
    return await CartModel.find().populate(CART_POPULATE);
}

const dbGetCartById = async (id) => {
    return await CartModel.findOne({ _id: id }).populate(CART_POPULATE);
}

// Get-or-create: nunca falla por "carrito no existe" y nunca duplica gracias
// al indice unique en userId (evita condiciones de carrera entre requests paralelos).
const dbGetOrCreateCartByUserId = async (userId) => {
    return await CartModel.findOneAndUpdate(
        { userId },
        { $setOnInsert: { userId, items: [] } },
        { returnDocument: 'after', upsert: true, runValidators: true }
    ).populate(CART_POPULATE);
}

const dbDeleteCart = async (id) => {
    return await CartModel.findOneAndDelete({ _id: id });
}

const dbUpdateCart = async (id, inputData) => {
    const { productId, quantity } = inputData;

    // 0. Validamos existencia y stock disponible del producto ANTES de tocar el carrito.
    const product = await ProductModel.findById(productId);

    if (!product) {
        throw new Error('El producto que intentas agregar no existe en el sistema');
    }

    if (quantity > 0) {
        const existingCart = await CartModel.findOne({ _id: id, 'items.productId': productId });
        const currentItem = existingCart?.items.find(i => i.productId.toString() === productId.toString());
        const currentQuantity = currentItem ? currentItem.quantity : 0;

        if (currentQuantity + quantity > product.stock) {
            throw new Error(`Solo hay ${product.stock} unidades disponibles de "${product.name}"`);
        }
    }

    // 1. Intentamos SUMAR la cantidad si el producto YA existe en el carrito
    let updatedCart = await CartModel.findOneAndUpdate(
        { _id: id, 'items.productId': productId },
        { $inc: { 'items.$.quantity': quantity } },
        { returnDocument: 'after', runValidators: true }
    );

    if (updatedCart) {
        // 2. El producto existía: revisamos la cantidad resultante
        const item = updatedCart.items.find(i => i.productId.toString() === productId.toString());

        if (item && item.quantity <= 0) {
            // Si quedó en 0 o menos, lo eliminamos del carrito
            updatedCart = await CartModel.findOneAndUpdate(
                { _id: id },
                { $pull: { items: { productId } } },
                { returnDocument: 'after' }
            );
        }

    } else {
        // 3. El producto NO existía en el carrito: lo agregamos como nuevo (solo si quantity > 0)
        if (quantity > 0) {
            updatedCart = await CartModel.findOneAndUpdate(
                { _id: id },
                { $push: { items: { productId, quantity } } },
                { returnDocument: 'after', runValidators: true }
            );
        } else {
            // Si mandan cantidad <= 0 para un producto que no existe, no hay nada que hacer
            updatedCart = await CartModel.findById(id);
        }
    }

    // 4. Repoblamos antes de devolver: el front siempre necesita nombre/precio/imagen,
    // no solo el ObjectId crudo.
    return await updatedCart.populate(CART_POPULATE);
};

// Elimina un producto del carrito por completo, sin importar la cantidad que tuviera.
const dbRemoveCartItem = async (id, productId) => {
    const updatedCart = await CartModel.findOneAndUpdate(
        { _id: id },
        { $pull: { items: { productId } } },
        { returnDocument: 'after' }
    );

    if (!updatedCart) return null;

    return await updatedCart.populate(CART_POPULATE);
};

// ---------------------------------------------------------------------------
// Variantes "por usuario": resuelven el carrito internamente a partir del
// userId (siempre sacado del token en el controlador), nunca de un :id de
// ruta. Reutilizan la logica ya probada de arriba sobre el _id resuelto.
// ---------------------------------------------------------------------------

const dbUpdateCartByUserId = async (userId, inputData) => {
    const cart = await dbGetOrCreateCartByUserId(userId);
    return await dbUpdateCart(cart._id, inputData);
};

const dbRemoveCartItemByUserId = async (userId, productId) => {
    const cart = await dbGetOrCreateCartByUserId(userId);
    return await dbRemoveCartItem(cart._id, productId);
};

const dbDeleteCartByUserId = async (userId) => {
    return await CartModel.findOneAndDelete({ userId });
};

export {
    insertCart,
    dbGetCart,
    dbGetCartById,
    dbGetOrCreateCartByUserId,
    dbDeleteCart,
    dbUpdateCart,
    dbRemoveCartItem,
    dbUpdateCartByUserId,
    dbRemoveCartItemByUserId,
    dbDeleteCartByUserId
};