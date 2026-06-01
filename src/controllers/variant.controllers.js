import mongoose from "mongoose";

import {  insertVariant, dbGetVariant, dbGetVariantById, dbDeleteVariant, dbUpdateVariant } from "../service/variant.service.js";



const dbGetVariant = async ( req, res ) => {

   try {
            const data =await dbGetVariant();

            res.json({
                msg: 'Obtener las variantes',
                data: data
    });
    
   } catch (error) {
    console.error(error)

    res.status(500).json ({
        msg:'no se pudo obtener el listado de variantes'
    })
    
   }
}


const GetVariantById = async (req, res) =>  {

    try {
        const id = req.params.id;

        //validación defensiva: condicionamos previo a que ocurra el error (nunca ocurre)

        if ( ! mongoose.Types.ObjectId.isValid(id)) {

            return res.status (400).json({
                 msg: 'El ID proporcionado es invalido'
            }) 
               
            
        }

    const data = await dbGetVariantById ( id);

    //validación directa al resultado de la consulta

    if (! data){
        return res.json({
            msg: 'No se puede obtener ID, variante no se encuentra registrada'
        })
    }

    res.json ({
        msg: ' Obtiene una variante por Id',
        data: data
    });

    } catch (error) {
        console.error( error );   

              res.status(500).json({
            msg: 'No se pudo obtener variante'
        });
    }
}


const createVariant = async ( req, res ) =>{
    try{
        const inputData = req.body;

        const data = await insertVariant ( inputData);
        
        res.json({
            msg: "crear una variante",
            data: data
    });
} catch (error) {
        console.error( error );   
        // validamos si la propiedad tiene un valor unico
        if (error.code === 11000){
            return res.json ({
                msg: 'Error de validación por duplicidad en propiedades unicasgit '
            })
        }

              res.status(500).json({
            msg: 'No se pudo registrar la variante'
        })
    }
}

const updateVariant =  async ( req, res ) => {

    try {
            const id = req.params.id;               //id de la ruta para encontrar el documento que quiero actualizar

            if ( ! mongoose.Types.ObjectId.isValid (id)){
                return res.status(400).json ({
                    msg: 'No se puede actualizar ID invalido'
                })
            }

    const inputData = req.body;            //obteniendo el objeto con el parametro que quiero actualizar

    const data = await dbUpdateVariant( id, inputData);
    //Creo una excepción 'falsa'

    if ( ! data ){
        throw new Error ('No se pudo actualizar la variante, porque no se encuentra registrado');
    }
        
    res.json({
        msg: 'Actualiza la variante',
        data: data
    });
}
     catch (error){
        console.error( error );  
        
        // validación exceotion: Manejar cuando ocurre el eror

        if ( error.name === 'CastError') {

            return res.status(400).json ({
                msg: 'No se pudo actualizar la variante, ID invalido'
            })
        }

        if ( error.message.includes('No se pudo actualizar la variante, porque no se encuentra registrado')){
            return res.json({
                msg: error.message 
            })
        }
            res.status(500).json({
                msg: 'No se pudo actualizar la  variante'
            } )
        
    }
}


const deleteVariant = async( req, res ) => {
    try {
         const id = req.params.id;

         if ( ! mongoose.Types.ObjectId.isValid (id)){
            return res.status(400).json({
                msg: 'no se puede eliminar ID invalido'
            })
         }
         
    const data = await dbDeleteVariant(id);

    if (! data) {
        return res.json ({
            msg: 'No se puede eliminar no exsiste variante'
        });
    }

      res.json({
        msg: 'Elimina una variante',
        data: data
    });

    } catch (error) {
        console.error( error );   

              res.status(500).json({
            msg: 'No se pudo eliminar la variante'
    }  
)
}
}
   

export {
    getVariant,
    GetVariantById,
    createVariant,
    updateVariant,
    deleteVariant
};
