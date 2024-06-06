import express from "express";
import {userAuthenticated } from "../middleware/auth.js";
import { stripeCheckoutSession, stripeWebhook } from "../controllers/paymentControllers.js";
const router = express.Router();

router.route('/payment/checkout_session').post(userAuthenticated,stripeCheckoutSession);
router.route('/payment/webhook').post(stripeWebhook);


export default router;