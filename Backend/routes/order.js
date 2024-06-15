import express from "express";
const router = express.Router();

import { allOrders, deleteOrder, getOrderDetails, getSales, myOrders, newOrder, updateOrder } from "../controllers/orderControllers.js";
import {authorizeRoles, userAuthenticated} from "../middleware/auth.js"


router.route("/orders/new").post(userAuthenticated,newOrder);
router.route("/orders/:id").get(userAuthenticated,getOrderDetails);
router.route("/profile/orders").get(userAuthenticated,myOrders);
router.route("/admin/orders").get(userAuthenticated,authorizeRoles("admin"),allOrders);
router
    .route("/admin/orders/:id")
    .put(userAuthenticated,authorizeRoles("admin"),updateOrder)
    .delete(userAuthenticated,authorizeRoles("admin"),deleteOrder);
router.route("/admin/get_sales").get(userAuthenticated,authorizeRoles("admin"),getSales);

export default router 