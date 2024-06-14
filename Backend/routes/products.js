import express from "express";
import {canUserReview, createProductReview, deleteProductDetails, deleteReview, getAdminProducts, getProductDetails, getProductReviews, getProducts, newProduct, updateProductDetails, uploadProductImages} from "../controllers/productControllers.js";
import {userAuthenticated, authorizeRoles} from "../middleware/auth.js";
const router = express.Router();

// sets up a route or /products that listens for GET requests.
router.route("/products").get(getProducts); 

// sets up a route for /admin/products that listens for POST requests.
router
    .route("/admin/products")
    .post(userAuthenticated, authorizeRoles("admin"),newProduct)
    .get(userAuthenticated, authorizeRoles("admin"),getAdminProducts);

router.route("/products/:id").get(getProductDetails);

router.route("/admin/products/:id").put(userAuthenticated, authorizeRoles("admin"),updateProductDetails);

router.route("/admin/products/:id").delete(userAuthenticated, authorizeRoles("admin"),deleteProductDetails);

router.route("/admin/products/:id/upload_images").put(userAuthenticated, authorizeRoles("admin"),uploadProductImages);


router
.route("/reviews")
.put(userAuthenticated,createProductReview)
.get(userAuthenticated,getProductReviews);

router.route("/admin/reviews").delete(userAuthenticated,deleteReview);

router.route("/can_review").get(userAuthenticated,canUserReview);


export default router;