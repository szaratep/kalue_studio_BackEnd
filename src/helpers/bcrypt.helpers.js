import { genSaltSync, hashSync, compareSync } from 'bcrypt';

const encryptedPassword = (orinalPassword) => {
    try{
        // Paso 1: Generar una cadena aleatorea (salt)
        const salt = genSaltSync(5);

        // Paso 2: Encriptar la contraseña
        const hasPassword = hashSync(orinalPassword, salt);
        
        //Paso 3: Retornar password encriptado listo para registrar

    }catch(error){
        console.error(error);

        return null;
    }
}