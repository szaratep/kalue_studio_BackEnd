import CategoryModel from "../models/Category.model.js"

const dbCreateCategory = async ( newCategory ) => {
    return await CategoryModel.create( newCategory );
}

const dbGetCategory = async () => {
    return await CategoryModel.find().populate('parentCategoryId', 'name');
}

// Al entrar a una categoria puntual, se listan tambien todos los productos
// que pertenecen a ella (via el virtual 'products' -> Product.category).
const dbGetCategoryByid = async ( id ) => {
    return await CategoryModel.findOne({ _id: id }).populate('parentCategoryId', 'name').populate('products', 'name price images isActive');
}

const dbUpdateCategory = async ( id, inputData ) => {
    return await CategoryModel.findByIdAndUpdate(id, inputData, { returnDocument: 'after', runValidators: true });
}

const dbDeleteCategory = async ( id ) => {
    return await CategoryModel.findOneAndDelete({ _id : id });
}

export {
    dbCreateCategory,
    dbDeleteCategory,
    dbGetCategory,
    dbGetCategoryByid,
    dbUpdateCategory,
}