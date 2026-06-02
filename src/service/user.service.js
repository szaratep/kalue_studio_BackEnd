import UserModel from "../models/User.model.js";

// Services: Su funcion es comunicarse con la base de datos
const dbCreateUser = async (newUser) => {
    return await UserModel.create(newUser);  
}

const dbGetUsers = async () => {
    return await UserModel.find().populate('contactID');
}

const dbGetUserByID = async (userId) =>{
    return await UserModel.findOne({ _id: userId }).populate('contactID');
}

const dbUpdateUser = async (userId, inputData) => {
    return await UserModel.findByIdAndUpdate(userId, inputData, { returnDocument: 'after', runValidators: true});
}

const dbDeleteUser = async (userId) => {
    return await UserModel.findByIdAndDelete(userId);
}

export {
    dbCreateUser,
    dbGetUsers,
    dbGetUserByID,
    dbUpdateUser,
    dbDeleteUser
}