import mongoose from "mongoose";
//import ProductModel from "../models/Product.model.js";
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

    try {
        const id = req.params.id;

        //validación defensiva: condicionamos previo a que ocurra el error (nunca ocurre)

        if ( ! mongoose.Types.ObjectId.isValid(id)) {

            return res.status (400).json({
                 msg: 'El ID proporcionado es invalido'
            }) 
               
            
        }

    const data = await dbGetProductById ( id);

    res.json ({
        msg: ' Obtiene un producto por Id',
        data: data
    });

    } catch (error) {
        console.error( error );   

              res.status(500).json({
            msg: 'No se pudo obtener producto'
        });
    }
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

            if ( ! mongoose.Types.ObjectId.isValid (id)){
                return res.status(400).son ({
                    msg: 'No se puede actualizar ID invalido'
                })
            }

    const inputData = req.body;            //obteniendo el objeto con el parametro que quiero actualizar

    const data = await dbUpdateProduct ( inputData);
        
    res.json({
        msg: 'Actualiza un producto',
        data: data
    });
}
     catch (error){
        console.error( error );  
        
        // validación exceotion: Manejar cuando ocurre el eror

        if ( error.name === 'CastError') {

            return res.status(400).json ({
                msg: 'No se pudo actualizar el producto, ID invalido'
            })
        }
            res.status(500).json({
                msg: 'No se pudo actualizar el producto'
            } )
        
    }
}


const deleteProduct = async( req, res ) => {
    try {
         const id = req.params.id;

         if ( ! mongoose.Types.ObjectId.isValid (id)){
            return res.status(400).json({
                msg: 'no se puede eliminar ID invalido'
            })
         }
         
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
