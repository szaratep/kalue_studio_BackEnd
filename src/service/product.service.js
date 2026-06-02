import ProductModel from "../models/product.model.js";

// Services: Su responsabilidad es hablarse con la base de datos
const insertProduct = async ( newProduct ) => {
    return await ProductModel.create( newProduct );
}

const dbGetProduct = async () => {
    return await ProductModel.find();
}

const dbGetProductById = async (id) => {
    return await ProductModel.findOne ({ _id: id});
}

const dbDeleteProduct = async (id) => {
    return await ProductModel.findOneAndDelete ({ _id: id});
}
const dbUpdateProduct = async (id, inputData) => {
    return await ProductModel.findOneAndDelete ({ _id: id});

}
export {
    insertProduct,
    dbGetProduct,
    dbGetProductById,
    dbDeleteProduct,
    dbUpdateProduct
}