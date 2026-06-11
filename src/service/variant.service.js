import VariantModel from "../models/Variant.model.js";

const insertVariant = async (newVariant) => {
    return await VariantModel.create(newVariant);
}

const dbGetVariant = async () => {
    return await VariantModel.find();
}

const dbGetVariantById = async (id) => {
    return await VariantModel.findOne({ _id: id });
}

const dbDeleteVariant = async (id) => {
    return await VariantModel.findOneAndDelete({ _id: id });
}

const dbUpdateVariant = async (id, inputData) => {
    return await VariantModel.findByIdAndUpdate(
        id,
        inputData,
        {
            new: true,
            runValidators: true
        }
    );
}

export {
    insertVariant,
    dbGetVariant,
    dbGetVariantById,
    dbDeleteVariant,
    dbUpdateVariant
}