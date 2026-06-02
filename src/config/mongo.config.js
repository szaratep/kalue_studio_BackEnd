import mongoose from 'mongoose';

const LOCAL_STRING_CONNECTION = 'mongodb://localhost:27017/db-store';
const REMOTE_STRING_CONNECTION = 'mongodb+srv://jcarlosj:saARXutKrVvHFHsO@cluster0.lapkq.mongodb.net/'

async function dbConect (){
    try{
        await mongoose.connect('mongodb://localhost:27017/Kalue_studio_db');
        console.log ('Connected to MongoDB local')
    }catch(error){
        console.error('Coneccion a la base de datos fallida\n\nError:\n' + error)
    }
}

export default dbConect;  