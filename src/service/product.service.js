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
}

const dbDeleteProduct = async (id) => {
    return await ProductModel.findOneAndDelete ({ _id: id});
}
const dbUpdateProduct = async (id, inputData) => {
    return await ProductModel.findOneAndUpdate ({ _id: id}, inputData,  {returnDocument: 'after', runValidators: true });

}

// Descuenta stock de forma atomica: la condicion "stock: { $gte: quantity }"
// se evalua en la misma operacion que el $inc, por lo que dos compras
// concurrentes nunca pueden dejar el stock en negativo (evita sobreventa).
// Si el filtro no encuentra coincidencia (no hay stock suficiente o el
// producto no existe/no esta activo), devuelve null y quien llama debe
// tratarlo como "stock insuficiente".
const dbDecrementProductStock = async (productId, quantity, session = null) => {
    return await ProductModel.findOneAndUpdate(
        { _id: productId, isActive: true, stock: { $gte: quantity } },
        { $inc: { stock: -quantity } },
        {  returnDocument: 'after', runValidators: true , session }
    );
}

export {
    insertProduct,
    dbGetProduct,
    dbGetProductById,
    dbDeleteProduct,
    dbUpdateProduct,
    dbDecrementProductStock
}