import { Router } from "express";
import { register } from "../controllers/userController";
import { login } from "../controllers/loginController";
const router = Router();
export default router;


//Rotas de login 

router.post("/register", register);

router.post("/login", login);


