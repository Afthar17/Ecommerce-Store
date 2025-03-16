import express from 'express';
import { signUp,login,logout,refreshToken,getUserProfile} from '../controllers/authController.js';
import { protectRoute } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/signup',signUp)
router.post('/login',login)
router.post('/logout',logout)
router.post('/refresh-token',refreshToken)
router.get('/profile',protectRoute,getUserProfile)


export default router