import express from "express";
import { Signin, login } from "../controllers/authControllers.js";
const router = express.Router();

router.route('/signin').post(Signin);
router.route('/login').post(login);

export default router;