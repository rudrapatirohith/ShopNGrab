import express from "express";
import {deleteProductDetails, getProductDetails, getProducts, newProduct, updateProductDetails} from "../controllers/productControllers.js";
import {userAuthenticated, authorizeRoles} from "../middleware/auth.js";
const router = express.Router();

// sets up a route or /products that listens for GET requests.
router.route("/products").get(getProducts); 

// sets up a route for /admin/products that listens for POST requests.
router.route("/admin/products").post(userAuthenticated, authorizeRoles("admin"),newProduct);

router.route("/products/:id").get(getProductDetails);

router.route("/admin/products/:id").put(userAuthenticated, authorizeRoles("admin"),updateProductDetails);

router.route("/admin/products/:id").delete(userAuthenticated, authorizeRoles("admin"),deleteProductDetails);

export default router;