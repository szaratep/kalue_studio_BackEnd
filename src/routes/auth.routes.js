import { Router } from "express"
import { createUser } from "../controllers/user.controller.js";
import { loginUser, reNewToken } from "../controllers/auth.controller.js";
import authenticationUser from "../middlewares/authentication.middleware.js";
import removeRol from "../middlewares/without-rol.middleware.js";

const router = Router();

// Define las rutas que manejan el flujo de autenticacion (USER);

// http:localhost:3000/api/auht
router.post('/login', loginUser);
router.post ('/register', removeRol, createUser);
router.get('/renew-token', authenticationUser, reNewToken); 

export default router;