import express from 'express';
import {addToCart,
        removeAllFromCart,
        updateQuantity,
        getAllFromCart} from '../controllers/cartController.js'
import {protectRoute,} from '../middlewares/authMiddleware.js'


const router = express.Router()

router.get('/',protectRoute,getAllFromCart)
router.post('/',protectRoute,addToCart)
router.delete('/',protectRoute,removeAllFromCart)
router.put('/:id',protectRoute,updateQuantity)


export default router