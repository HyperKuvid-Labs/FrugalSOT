import { Router } from "express";
import { userRegister, userLogin } from "../controllers/user.controller.js";
// import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.post('/sign-up', userRegister);
router.post('/sign-in', userLogin);

export default router;