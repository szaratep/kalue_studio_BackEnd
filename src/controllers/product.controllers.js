import ProductModel from "../models/Product.model.js";
import { dbDeleteProduct, dbGetProduct, dbGetProductById, dbUpdateProduct, insertProduct } from "../service/product.service.js";



const getProduct = async ( req, res ) => {

   try {
            const data =await dbGetProduct();

            res.json({
                msg: 'Obtener los productos',
                data: data
    });
    
   } catch (error) {
    console.error(error)

    res.status(500).json ({
        msg:'no se pudo obtener el listado de productos'
    })
    
   }
}
const GetProductById = async (req, res) =>  {

    const id = req.params.id;

    const data = await dbGetProductById ( id);

    res.json ({
        msg: ' Obtiene un producto por Id',
        data: data
    })
}


const createProduct = async ( req, res ) =>{
    try{
        const inputData = req.body;

        const data = await insertProduct ( inputData);
        
        res.json({
            msg: "crear un producto",
            data: data
    });
} catch (error) {
        console.error( error );   

              res.status(500).json({
            msg: 'No se pudo registrar el producto'
        })
    }
}

const updateProduct =  async ( req, res ) => {

    try {
            const id = req.params.id;               //id de la ruta para encontrar el documento que quiero actualizar
    const inputData = req.body;            //obteniendo el objeto con el parametro que quiero actualizar

    const data = await dbUpdateProduct ( inputData);

    res.json({
        msg: 'Actualiza un producto',
        data: data
    });
}
     catch (error){
        console.error( error );   
            res.status(500).json({
                msg: 'No se pudo actualizar el producto'
            } )
        
    }
}


const deleteProduct = async( req, res ) => {
    try {
         const id = req.params.id;

    const data = await dbDeleteProduct(id);

      res.json({
        msg: 'Elimina un producto',
        data: data
    });

    } catch (error) {
        console.error( error );   

              res.status(500).json({
            msg: 'No se pudo eliminar el producto'
    }  
)
}
}
   

export {
    getProduct,
    GetProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
