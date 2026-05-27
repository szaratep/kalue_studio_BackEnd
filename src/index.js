import express, { json } from 'express';

import dbConect from './config/mongo.config.js';

import userRoutes from './routes/user.routes.js';
import orderRoutes from './routes/order.routes.js';

const app = express();

//Conexion a la base de datos
dbConect();

//lector de json
app.use(express.json());

//Endpoint Health
app.get ("/health", (req, res) => {
    res.json({
        msg: "Sitio Funcionando"
    })
})

//Endpoints agrupados por entidad
//user
app.use('/users', userRoutes);
app.use('/orders', orderRoutes);

//Lanzamiento del servidor
app.listen(3000, () =>{
    console.log('Server running on: http://localhost:3000');
})