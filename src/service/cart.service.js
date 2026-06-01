import CartModel from '../models/cart.model.js';

const insertCart = async (newCart) => {
    return await CartModel.create(newCart);
}

const dbGetCart = async () => {
    return await CartModel.find();
}

const dbGetCartById = async (id) => {
    return await CartModel.findOne({ _id: id });
}

const dbDeleteCart = async (id) => {
    return await CartModel.findOneAndDelete({ _id: id });
}

const dbUpdateCart = async (id, inputData) => {
    return await CartModel.findByIdAndUpdate(
        id,
        inputData,
        {
            new: true,
            runValidators: true
        }
    );
}

export {
    insertCart,
    dbGetCart,
    dbGetCartById,
    dbDeleteCart,
    dbUpdateCart
};