import mongoose, { MongooseError } from 'mongoose';
import { dbDeleteOrders, dbGetOrders, dbGetOrdersById, dbInsertOrders, dbUpdateOrders,  } from '../service/order.service.js';

async function getOrder (req, res){
    try{
        const data = await dbGetOrders();
        
        res.status(200).json({
            data: data
        })
    }catch(error){
        console.error(error);
        res.status(500).json({
            msg: 'No existe ningun registro'
        });
    }
}

async function getOrderById(req, res){
    try{
        const id = req.params.idOrder;

        //validacion defensiva: condicionamos antes de que ocurra un error (nunca ocurre)
        if (!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({ msg: "El Id es invalido, porfavor verificar, no sea bruto"})
        }

        const data = await dbGetOrdersById(id);

        if (!data){
            return res.status(400).json({ msg: "No se puede encontrar la orden por que no existe"});
        }

        res.status(200).json({
            msg: 'Se encontro con exito',
            data : data
        })
    }catch(error){
        console.error(error);
        res.status(500).json({
            msg : "Se produjo un error al encontrar tu orden"
        });
    }
}

async function createOrder (req, res){
    try{
        const inputData = req.body;

        const data = await dbInsertOrders(inputData);

        res.status(201).json({
            data: data
        });
    }catch(error){
        console.error(error);

        //se valida si la propiedad tiene algun valor unico
        if (error.code === 11000){
            return res.json({ msg: "Este campo es unico y no se puede repetir" })
        }

        res.status(500).json({
            msg:"se genero un error al crear tu orden"
        })
    }
}

async function updateOrder (req, res){

    try{
        const id = req.params.idOrder

        const inputData = req.body
 
        const data = await dbUpdateOrders(id, inputData);

        // crear juna Excepcion "falsa" throw exception
        if (!data){
            // crea / induce a un error (es creada por el desarollador) 
            throw new Error( 'No se logra actualizar el producto ya que no se encuentra registrado' )
        }

        res.json({
            msg: 'Se ha actualizado el usuario con exito',
            data: data
        })
    }catch(error){
        //validacion de exeception: Manejar cuando ocurre algun error
        if ( error.name === 'CastError' ){
            return res.status(400).json({ msg: "No puedo actualizar por que el id es invalido"})
        }

        if (error.message === 'No se logra actualizar el producto ya que no se encuentra registrado'){
            return res.json({
                msg: error.message
            });
        }

        console.error(error)
        res.status(500).json({
            msg : "No se logro realizar la actualizacion, intentalo de nuevo"
        })
    }
}

async function deleteOrder (req, res){
    try{
        const id = req.params.idOrder;

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({ msg: "No se puede eliminar ya que el id es invalido" })
        }

        const data = await dbDeleteOrders(id);


        if (!data){
            return res.status(400).json({ msg: "el objeto no exite" })
        }

        res.status(200).json({
            msg: 'Orden eliminada exitosamente',
            data : data
        })
    }catch(error){
        console.error(error);
        res.status(500).json({
            msg: "no se logro realizar la eliminacion, id invalido"
        })
    }
    
}

export {
    getOrder,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder
}