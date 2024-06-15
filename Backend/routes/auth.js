import express from "express";
import { Signin, deleteUser, forgotPassword, getAllUsers, getUserDetails, getUserProfile, login, logout, resetPassword, updatePassword, updateProfile, updateUser, uploadAvatar } from "../controllers/authControllers.js";
import { authorizeRoles, userAuthenticated } from "../middleware/auth.js";
const router = express.Router();

router.route('/signin').post(Signin);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').put(resetPassword);
router.route('/profile').get(userAuthenticated,getUserProfile);
router.route('/password/update').put(userAuthenticated,updatePassword);
router.route('/profile/update').put(userAuthenticated,updateProfile);
router.route('/profile/upload_avatar').put(userAuthenticated,uploadAvatar);
router.route('/admin/users').get(userAuthenticated,authorizeRoles('admin'),getAllUsers);
router.route('/admin/users/:id').get(userAuthenticated,authorizeRoles('admin'),getUserDetails);
router.route('/admin/users/:id').put(userAuthenticated,authorizeRoles('admin'),updateUser);
router.route('/admin/users/delete/:id').delete(userAuthenticated,authorizeRoles('admin'),deleteUser);

export default router;