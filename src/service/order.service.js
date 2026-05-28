import orderModel from "../models/Order.model.js";

const dbInsertOrders = async (newOrder) => {
    return await orderModel.create(newOrder)
};

const dbGetOrders = async () => {
    return await orderModel.find();
};

const dbGetOrdersById = async (orderId) => {
    return await orderModel.findOne({_id: orderId});
};

const dbUpdateOrders = async(orderId, inputData) => {
    return await orderModel.findByIdAndUpdate(orderId, inputData, { returnDocument: 'after' });
};

const dbDeleteOrders = async(orderId) => {
    return await orderModel.findByIdAndDelete(orderId);
};

export {
    dbInsertOrders,
    dbGetOrders,
    dbGetOrdersById,
    dbUpdateOrders,
    dbDeleteOrders
};