import CartModel from '../models/Cart.model.js';

const insertCart = async (newCart) => {
    return await CartModel.create(newCart);
}

const dbGetCart = async () => {
    return await CartModel.find().populate('items.productId', 'name price images category');
}

const dbGetCartById = async (id) => {
    return await CartModel.findOne({ _id: id }).populate('items.productId', 'name price images category');
}

const dbDeleteCart = async (id) => {
    return await CartModel.findOneAndDelete({ _id: id });
}

const dbUpdateCart = async (id, inputData) => {
    const { productId, quantity } = inputData;

    // 1. Intentamos SUMAR la cantidad si el producto YA existe en el carrito
    let updatedCart = await CartModel.findOneAndUpdate(
        { _id: id, 'items.productId': productId },
        { $inc: { 'items.$.quantity': quantity } },
        { new: true, runValidators: true }
    );

    if (updatedCart) {
        // 2. El producto existía: revisamos la cantidad resultante
        const item = updatedCart.items.find(i => i.productId.toString() === productId.toString());

        if (item && item.quantity <= 0) {
            // Si quedó en 0 o menos, lo eliminamos del carrito
            updatedCart = await CartModel.findOneAndUpdate(
                { _id: id },
                { $pull: { items: { productId } } },
                { new: true }
            );
        }

    } else {
        // 3. El producto NO existía en el carrito: lo agregamos como nuevo (solo si quantity > 0)
        if (quantity > 0) {
            updatedCart = await CartModel.findOneAndUpdate(
                { _id: id },
                { $push: { items: { productId, quantity } } },
                { new: true, runValidators: true }
            );
        } else {
            // Si mandan cantidad <= 0 para un producto que no existe, no hay nada que hacer
            updatedCart = await CartModel.findById(id);
        }
    }

    return updatedCart;
};

export {
    insertCart,
    dbGetCart,
    dbGetCartById,
    dbDeleteCart,
    dbUpdateCart
};