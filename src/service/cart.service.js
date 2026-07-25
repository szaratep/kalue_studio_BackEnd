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
    return await CartModel.findByIdAndUpdate(id, inputData, { returnDocument: 'after', runValidators: true});
}

export {
    insertCart,
    dbGetCart,
    dbGetCartById,
    dbDeleteCart,
    dbUpdateCart
};