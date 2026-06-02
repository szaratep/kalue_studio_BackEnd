import orderModel from "../models/Order.model.js";

const dbCreateOrders = async (newOrder) => {
    return await orderModel.create(newOrder)
};

const dbGetOrders = async () => {
    return await orderModel.find().populate('products.productID', 'name price descripcion imagen category');
};

const dbGetOrdersById = async (orderId) => {
    return await orderModel.findOne({_id: orderId}).populate('products.productID', 'name price descripcion imagen category');
};

const dbUpdateOrders = async(orderId, inputData) => {
    return await orderModel.findByIdAndUpdate(orderId, inputData, { returnDocument: 'after', runValidators: true});
};

const dbDeleteOrders = async(orderId) => {
    return await orderModel.findByIdAndDelete(orderId);
};

export {
    dbCreateOrders,
    dbGetOrders,
    dbGetOrdersById,
    dbUpdateOrders,
    dbDeleteOrders
};