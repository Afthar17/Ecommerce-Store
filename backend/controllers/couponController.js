import Coupon from "../models/couponModel.js";
import asyncHandler from "express-async-handler";



export const getAllCoupons = asyncHandler(async(req,res)=>{
    try {
        const coupons = await Coupon.findOne({userId :req.user._id,isActive: true})
        res.json(coupons || [])
    } catch (error) {
        console.log('error in getAllCoupons',error.message)
    }
})

export const validateCoupon = asyncHandler(async(req,res)=>{
    try {
        const {code} = req.body
        const coupon = await Coupon.findOne({code,isActive:true})
        if(!coupon){
            return res.status(404).json({message: 'Coupon not found'})
        }
        if(coupon.expirationDate < new Date()){
            coupon.isActive = false
            await coupon.save()
            return res.status(404).json({message: 'Coupon expired'})
        }
        res.json({
            message: 'Coupon is valid',
            code: coupon.code,
            discountPercentage: coupon.discountPercentage
        })
    } catch (error) {
        console.log('error in validateCoupon',error.message)
        res.status(500).json({message: error.message})
    }
})