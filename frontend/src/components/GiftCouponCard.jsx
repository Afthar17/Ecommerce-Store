import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useCartStore } from '../stores/useCartStore'

const GiftCouponCard = () => {
    const [userInputCode, setUserInputCode] = useState('')
    const { coupon, isCouponApplied, applyCoupon, removeCoupon,getCoupon } = useCartStore()
    useEffect(() => {
        getCoupon()
    },[getCoupon])

    useEffect(() => {
        if (coupon) {
            setUserInputCode(coupon.code)
        }
    }, [coupon])

    const handleCouponApply = () => {
        if(!userInputCode) return
        applyCoupon(userInputCode)
    }
    const handleRemoveCoupon = async () => {
        await removeCoupon()
    }
    return (
        <motion.div
            className='space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6 items-center justify-center'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: .2 }}>
            <div className="space-y-4">
                <label htmlFor="voucher" className="mb-2 block text-sm font-medium text-gray-300">
                    Do you have a gift card or discount code?
                </label>
                <input
                    id="voucher"
                    type="text"
                    className="block w-full rounded-lg border border-gray-600 bg-gray-700 p-2 text-sm
                     text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-emerald-500 focus:outline-none"
                    placeholder='Enter coupon code'
                    value={userInputCode}
                    onChange={(e) => setUserInputCode(e.target.value)}
                    required />
            </div>
            <motion.button className='flex w-full items-center justify-center bg-emerald-600  text-white px-4 py-2 rounded-md
                text-sm font-medium  hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCouponApply}>
                Apply Coupon
            </motion.button>
            {coupon && isCouponApplied && (
                <div className="mt-4">
                    <h3 className='text-lg font-medium text-gray-300'>
                        Coupon Applied:
                    </h3>
                    <p className=' mt-2 text-sm font-medium text-gray-400'>
                        {coupon.code} - {coupon.discountPercentage}% off
                    </p>
                    <motion.button
                        className='mt-2 flex w-full items-center justify-center bg-red-600 text-white px-4 py-2 rounded-lg
                            text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300'
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleRemoveCoupon}>
                        Remove Coupon
                    </motion.button>
                </div>
            )}
            {coupon && (
                <div className="mt-4">
                    <h3 className='text-lg font-medium text-gray-300'>
                        Available Coupon :
                    </h3>
                    <p className=' mt-2 text-sm font-medium text-gray-400'>
                        {coupon.code} - {coupon.discountPercentage}% off
                    </p>
                </div>
            )}
        </motion.div>
    )
}

export default GiftCouponCard