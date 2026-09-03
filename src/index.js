
import express from 'express';
import cors from 'cors';

import dbConect from './config/mongo.config.js';

import userRoutes from './routes/user.routes.js';

import contactsRoutes from './routes/contact.routes.js'
import ordersRoutes from './routes/order.routes.js'
import productRoutes from './routes/product.routes.js'
import cartRoutes from './routes/cart.routes.js';
import authRoutes from './routes/auth.routes.js'
import roleRoutes from './routes/roles.routes.js'
import categoryRoutes from './routes/category.routes.js';
import materialRoutes from './routes/material.routes.js'


const app = express();
const PORT = process.env.PORT || 3001;

//Conexion a la base de datos
dbConect();

//Middelwares
app.use(express.json()); //habilita la interpretacion de objetos json
app.use(cors({
    //origin: 'http://localhost:4200'
}))

//Endpoint Health
app.get ("/health", (req, res) => {
    res.json({
        msg: "Sitio Funcionando"
    })
})

//Endpoints agrupados por entidad
//user
app.use('/api/users', userRoutes);
app.use('/api/contacts', contactsRoutes);
app.use('/api/orders', ordersRoutes)
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/material', materialRoutes);

//Lanzamiento del servidor
app.listen(PORT, () =>{
    console.log(`Server running on: http://localhost:${PORT}`);
})