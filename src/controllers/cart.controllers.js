import mongoose from "mongoose";
//import ProductModel from "../models/Product.model.js";
import { insertCart, dbGetCart, dbGetCartById, dbDeleteCart, dbUpdateCart } from '../service/cart.service.js';



const getCart = async (req, res) => {

    try {
        const data = await dbGetCart();

        res.json({
            msg: 'Obtener carrito',
            data: data
        });

    } catch (error) {
        console.error(error)

        res.status(500).json({
            msg: 'no se pudo obtener el listado del carrito'
        })

    }
}


const GetCartById = async (req, res) => {

    try {
        const id = req.params.id;

        //validación defensiva: condicionamos previo a que ocurra el error (nunca ocurre)

        if (!mongoose.Types.ObjectId.isValid(id)) {

            return res.status(400).json({
                msg: 'El ID proporcionado es invalido'
            })


        }

        const data = await dbGetCartById(id);

        //validación directa al resultado de la consulta

        if (!data) {
            return res.json({
                msg: 'No se puede obtener ID, no se encuentra registrado'
            })
        }

        res.json({
            msg: ' Obtiene un producto por Id',
            data: data
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            msg: 'No se pudo obtener el carrito'
        });
    }
}


const createCart = async (req, res) => {
    try {
        const inputData = req.body;

        const data = await insertCart(inputData);

        res.json({
            msg: "crear carrito",
            data: data
        });
    } catch (error) {
        console.error(error);
        // validamos si la propiedad tiene un valor unico
        if (error.code === 11000) {
            return res.json({
                msg: 'Error de validación por duplicidad en propiedades unicas '
            })
        }

        res.status(500).json({
            msg: 'No se pudo registrar el carrito'
        })
    }
}

const updateCart = async (req, res) => {

    try {
        const id = req.params.id;               //id de la ruta para encontrar el documento que quiero actualizar

        // if ( ! mongoose.Types.ObjectId.isValid (id)){
        //     return res.status(400).json ({
        //         msg: 'No se puede actualizar ID invalido'
        //     })
        // }

        const inputData = req.body;            //obteniendo el objeto con el parametro que quiero actualizar

        const data = await dbUpdateCart(id, inputData);
        //Creo una excepción 'falsa'

        // if ( ! data ){
        //     throw new Error ('No se pudo actualizar el carrito, porque no se encuentra registrado');
        // }

        res.json({
            msg: 'Actualiza el carrito',
            data: data
        });
    }
    catch (error) {
        console.error(error);

        // validación exceotion: Manejar cuando ocurre el eror

        if (error.name === 'CastError') {

            return res.status(400).json({
                msg: 'No se pudo actualizar el carrito, ID invalido'
            })
        }

        if (error.message.includes('No se pudo actualizar el carrito, porque no se encuentra registrado')) {
            return res.json({
                msg: error.message
            })
        }
        res.status(500).json({
            msg: 'No se pudo actualizar el carrito'
        })

    }
}


const deleteCart = async (req, res) => {
    try {
        const id = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                msg: 'no se puede eliminar ID invalido'
            })
        }

        const data = await dbDeleteCart(id);

        if (!data) {
            return res.json({
                msg: 'No se puede eliminar no exsiste carrito'
            });
        }

        res.json({
            msg: 'Elimina carrito',
            data: data
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            msg: 'No se pudo eliminar carrito'
        }
        )
    }
}


export {
    getCart,
    GetCartById,
    createCart,
    updateCart,
    deleteCart
};
