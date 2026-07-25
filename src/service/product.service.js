import ProductModel from '../models/Product.model.js';

// Services: Su responsabilidad es hablarse con la base de datos
const insertProduct = async ( newProduct ) => {
    return await ProductModel.create( newProduct );
}

// Listado: solo referencias livianas de category/material, sin variantes (evita payloads pesados).
const dbGetProduct = async () => {
    return await ProductModel.find()
        .populate('category', 'name description')
        .populate('material', 'name description');
}

// Detalle: ademas de category/material, se incluyen las variantes del producto.
const dbGetProductById = async (id) => {
    return await ProductModel.findOne({ _id: id })
        .populate('category', 'name description')
        .populate('material', 'name description')
        .populate('variants', 'color colorCode size price stock sku');
}

const dbDeleteProduct = async (id) => {
    return await ProductModel.findOneAndDelete ({ _id: id});
}
const dbUpdateProduct = async (id, inputData) => {
    return await ProductModel.findOneAndUpdate ({ _id: id}, inputData);

}
export {
    insertProduct,
    dbGetProduct,
    dbGetProductById,
    dbDeleteProduct,
    dbUpdateProduct
}