import express from "express";
import { Signin, forgotPassword, login, logout } from "../controllers/authControllers.js";
const router = express.Router();

router.route('/signin').post(Signin);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/password/forgot').post(forgotPassword);

export default router;