import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'

export const protectRoute = async(req,res,next)=>{
    try {
        const accessToken = req.cookies.accessToken
        if(!accessToken){
            return res.status(401).json({message: 'user is not authenticated'})
        }
        try {
            const decoded = jwt.verify(accessToken,process.env.ACCESS_SECRET)
            const user = await User.findById(decoded.id).select('-password')

            if(!user){
                return res.status(404).json({message: 'user not found'})
            }
            req.user = user
            next()
        } catch (error) {
            if (error.name === 'TokenExpiredError'){
                return res.status(401).json({
                    message: 'Token Expired'
                })
            }else{
                throw error
            }
        }
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

export const adminRoute = async(req,res,next)=>{
    try {
        if(req.user && req.user.role === 'admin'){
            next()
        }else{
            return res.status(403).json({message: 'Access Denied'})
        }
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}
