import express from 'express';
import {getAllProducts,
        getFeaturedProducts,
        createProducts,
        deleteProduct,
        getRecomendedProducts,
        getProductsByCategory,
        toggleFeaturedProducts} from '../controllers/productController.js'
import {protectRoute,adminRoute} from '../middlewares/authMiddleware.js'


const router = express.Router()


router.get('/',protectRoute,adminRoute,getAllProducts)
router.get('/featured',getFeaturedProducts)
router.get('/category/:category',getProductsByCategory)
router.get('/recomendations',getRecomendedProducts)
router.post('/',protectRoute,adminRoute,createProducts)
router.patch('/:id',protectRoute,adminRoute,toggleFeaturedProducts)
router.delete('/:id',protectRoute,adminRoute,deleteProduct)


export default router