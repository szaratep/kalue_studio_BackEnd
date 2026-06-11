import { Router } from "express"
import { createUser } from "../controllers/user.controller.js";
import { loginUser } from "../controllers/auth.controller.js";

const router = Router();

// Define las rutas que manejan el flujo de autenticacion (USER);

// http:localhost:3000/api/auht
router.post('/login', loginUser);
router.post ('/register', createUser);
//router.get('/renew-token', authenticationUser, ); 

export default router;