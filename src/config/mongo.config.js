import mongoose from 'mongoose';

const DB_MONGO = process.env.DB_URI_VIRT

async function dbConect (){
    try{
        await mongoose.connect(DB_MONGO);
        console.log ('Connected to MongoDB Atlas')
    }catch(error){
        console.error('Coneccion a la base de datos fallida\n\nError:\n' + error)
    }
}

export default dbConect;  