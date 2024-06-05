import express from "express";
import {userAuthenticated } from "../middleware/auth.js";
import { stripeCheckoutSession } from "../controllers/paymentControllers.js";
const router = express.Router();

router.route('/payment/checkout_session').post(userAuthenticated,stripeCheckoutSession);

export default router;