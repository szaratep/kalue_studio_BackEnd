import MaterialModel from "../models/Material.model.js";

const dbCreateMaterial = async (newMaterial) => {
    return await MaterialModel.create(newMaterial);
}

const dbGetMaterials = async () => {
    return await MaterialModel.find();
}

const dbGetActiveMaterials = async () => {
    return await MaterialModel.find({ isActive: true });
}

const dbGetMaterialById = async (materialId) => {
    return await MaterialModel.findOne({ _id: materialId });
}

const dbGetMaterialByName = async (name) => {
    return await MaterialModel.findOne({ name: name, isActive: true });
}

const dbUpdateMaterial = async (materialId, inputData) => {
    return await MaterialModel.findByIdAndUpdate(materialId, inputData, { returnDocument: 'after', runValidators: true });
}

const dbDeleteMaterial = async (materialId) => {
    return await MaterialModel.findByIdAndDelete(materialId);
}

export {
    dbCreateMaterial,
    dbGetMaterials,
    dbGetActiveMaterials,
    dbGetMaterialById,
    dbGetMaterialByName,
    dbUpdateMaterial,
    dbDeleteMaterial
}