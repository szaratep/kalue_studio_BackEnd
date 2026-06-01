
import express from 'express';

import dbConect from './config/mongo.config.js';

import userRoutes from './routes/user.routes.js';
import productRoutes from './routes/product.routes.js'

const app = express();

//Conexion a la base de datos
dbConect();

app.use (express.json());

//Endpoint Health
app.get ("/health", (req, res) => {
    res.json({
        msg: "Sitio Funcionando"
    })
})

//Endpoints agrupados por entidad
//user
app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/variants', variantRoutes);

//Lanzamiento del servidor
app.listen(3000, () =>{
    console.log('Server running on: http://localhost:3000');
})