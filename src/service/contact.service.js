import ContactModel from "../models/Contact.model.js";

const dbGetContact = async (userId) => {
    return await ContactModel.find({ userId });
}

const dbGetContactById = async (idContact) => {
    return await ContactModel.findOne({ _id : idContact })
}

const dbCreateContact = async (inputData) => {
    return await ContactModel.create(inputData);
}

const dbUpdateContact = async (idContact, inputData) => {
    return await ContactModel.findByIdAndUpdate(idContact, inputData, {returnDocument: 'after', runValidators: true});
}

const dbDeleteContact = async (idContact) => {
    return await ContactModel.findByIdAndDelete(idContact);
}

export {
    dbCreateContact,
    dbGetContact,
    dbDeleteContact,
    dbGetContactById,
    dbUpdateContact
}