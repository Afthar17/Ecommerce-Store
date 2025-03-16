import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'
import {redis} from '../lib/redis.js'
import cloudinary from '../lib/cloudinary.js'

// @desc Fetch all products
// @route GET /api/products
// @access Private admin

export const getAllProducts = asyncHandler(async(req,res)=>{
    try {
        const products = await Product.find({})
        res.json(products)
    } catch (error) {
        console.log('error in getAllProducts',error.message)
        res.status(500).json({message: error.message})
    }
})


export const getFeaturedProducts = asyncHandler(async(req,res)=>{
    try {
        let featuredProducts = await redis.get('featuredProducts')
        if(featuredProducts){
            return res.json(JSON.parse(featuredProducts))
        }

        // if not found in cache we will check it in mongoDB
        //.lean() is used to get plain javascript object instead of mongoose   
        //which is good for performance 
        featuredProducts = await Product.find({isFeatured: true}).lean()

        if(!featuredProducts){
            return res.status(404).json({message: 'Featured products not found'})
        }

        // store in redis for future quick access
        await redis.set('featuredProducts',JSON.stringify(featuredProducts))
    } catch (error) {
        console.log('error in getFeaturedProducts', error.message)
        res.status(500).json({message: error.message})
    }
})

export const createProducts = asyncHandler(async(req,res)=>{
    try {
        const {name,description,price,quantity,image,category} = req.body

        let cloudinaryResponse = null

        if(image){
            cloudinaryResponse =await cloudinary.uploader.upload(image,{folder:'products'})
        }
        const product = await Product.create({
            name,
            description,
            price,
            image: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : '',
            quantity,
            category
        })
        res.status(201).json(product)
    } catch (error) {
        console.log('error in createProducts',error.message)
        res.status(500).json({message: error.message})
    }
})

export const deleteProduct = asyncHandler(async(req,res)=>{
    try {
        const product = await Product.findById(req.params.id)
        if(!product){
            return res.status(404).json({message: 'Product not found'})
        }
        if(product.image){
            const imageId = product.image.split('/').pop().split('.')[0]  //this will get the image id
            await cloudinary.uploader.destroy(`products/${imageId}`)
            console.log('delete from cloudinary')
        }
        await Product.findByIdAndDelete(req.params.id)
        res.json({message: 'Product deleted successfully'})
    } catch (error) {
        console.log('error in deleteProduct',error.message)
        res.status(500).json({message: error.message})
    }
})

export const getRecomendedProducts = asyncHandler(async(req,res)=>{
    try {
        const products = await Product.aggregate([
            {
                $sample: {size: 3}
            },
             {
                 $project:   {
                    name:1,
                    _id:1,
                    desscription:1,
                    price:1,
                    image:1
                }
             }
        ])
        res.json(products)
    } catch (error) {
        console.log('error in getRecomendedProducts',error.message)
        res.status(500).json({message: error.message})
    }
})

export const getProductsByCategory = asyncHandler(async(req,res)=>{
    const {category} = req.params
    try {
        const products = await Product.find({category})
        res.json({products})
    } catch (error) {
        console.log('error in getProductsByCategory',error.message)
        res.status(500).json({message: error.message})
    }
})

export const toggleFeaturedProducts = asyncHandler(async(req,res)=>{
    try {
        const product = await Product.findById(req.params.id)
        if(product){
            product.isFeatured = !product.isFeatured
            const updatedProduct = await product.save()
            await updateFeaturedProductsCache()
            res.json(updatedProduct)
        }else{
            res.status(404).json({message: 'Product not found'})
        }
    } catch (error) {
        console.log('error in toggleFeaturedProducts',error.message)
        res.status(500).json({message: error.message})
    }
})

async function updateFeaturedProductsCache(){
    try {
        const featuredProducts =  await Product.find({isFeatured: true}).lean()
        await redis.set('featuredProducts',JSON.stringify(featuredProducts))
    } catch (error) {
        console.log(error)
    }
}