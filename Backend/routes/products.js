import express from "express";
import {deleteProductDetails, getProductDetails, getProducts, newProduct, updateProductDetails} from "../controllers/productControllers.js";
const router = express.Router();

// sets up a route or /products that listens for GET requests.
router.route("/products").get(getProducts); 

// sets up a route for /admin/products that listens for POST requests.
router.route("/admin/products").post(newProduct);

router.route("/products/:id").get(getProductDetails);

router.route("/products/:id").put(updateProductDetails);

router.route("/products/:id").delete(deleteProductDetails);

export default router;