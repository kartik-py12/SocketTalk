import express from "express";
import { signin,signup,me,logout,updateProfile,checkAuth, testAccount} from "../controllers/auth.controller.js";
import { validateSchema } from "../middleware/validate.middleware.js";
import { signUpSchema,signInSchema } from "../zodSchema/auth.zodSchema.js";
import { protectRoute } from "../middleware/protectedRoute.middleware.js";
const router = express.Router();

router.post('/signup',validateSchema(signUpSchema),signup);
router.post('/signin',validateSchema(signInSchema),signin);
router.get('/testaccount',testAccount);
router.get('/me',protectRoute,me)
router.get('/check',protectRoute,checkAuth);
router.post('/logout',protectRoute,logout);
router.put('/update-profile',protectRoute,updateProfile)

export default router;