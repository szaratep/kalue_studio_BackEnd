import express from 'express';

import dbConect from './config/mongo.config.js';

import userRoutes from './routes/user.routes.js';
import contactsRoutes from './routes/contact.routes.js'
import ordersRoutes from './routes/order.routes.js'

const app = express();

//Conexion a la base de datos
dbConect();

//Middelwares
app.use(express.json()); //habilita la interpretacion de objetos json

//Endpoint Health
app.get ("/health", (req, res) => {
    res.json({
        msg: "Sitio Funcionando"
    })
})

//Endpoints agrupados por entidad
//user
app.use('/users', userRoutes);
app.use('/contacts', contactsRoutes);
app.use('/orders', ordersRoutes)

//Lanzamiento del servidor
app.listen(3000, () =>{
    console.log('Server running on: http://localhost:3000');
})