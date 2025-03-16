
import { motion } from 'framer-motion'
import { useCartStore } from '../stores/useCartStore'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import axios from '../lib/axios'

const stripePromise = loadStripe('pk_test_51QefM8HkuPpWjD7nTHS48WwtqHiiLi1iF1nPEddhvlFlMygAya4GZB0sqB0L2nDYtq7tjAuusIiknhWDUn5JM0bB00StKJPfYV')

const OrderSummary = () => {
    
    const { subtotal, total, coupon, isCouponApplied, cart } = useCartStore()
    const savings = subtotal - total
    const formattedSubtotal = subtotal.toFixed(2)
    const formattedTotal = total.toFixed(2)
    const formattedSavings = savings.toFixed(2)
    const handlePayment = async () => {
        
        const stripe = await stripePromise
        const res = await axios.post('/payments/create-checkout-session', {
            products: cart,
            couponCode: coupon ? coupon.code : null
        })
        const session = res.data
        const result = await stripe.redirectToCheckout({
            sessionId: session.id
        })
        if (result.error) {
            console.log(result.error)
        }
    }
    return (
        <motion.div
            className='space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6 items-center justify-center'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}>
            <p className='text-xl font-semibold text-emerald-400'>Order Summery</p>
            <div className="space-y-4">
                <div className="space-y-4 divide-y divide-gray-700 ">
                    <div>
                        <dl className='flex items-center justify-between gap-4'>
                            <dt className='text-base font-normal text-gray-300'>Orginal summary</dt>
                            <dd className='text-base font-medium text-white'>${formattedSubtotal}</dd>
                        </dl>
                        {savings > 0 && (
                            <dl className='flex items-center justify-between gap-4'>
                                <dt className='text-base font-normal text-gray-300'>Saving</dt>
                                <dd className='text-base font-medium text-emerald-400'>$-{formattedSavings}</dd>
                            </dl>
                        )}
                        {coupon && isCouponApplied && (
                            <dl className='flex items-center justify-between gap-4'>
                                <dt className='text-base font-normal text-gray-300'>Coupon ({coupon.code})</dt>
                                <dd className='text-base font-medium text-emerald-400'>$-{coupon.discountPercentage}%</dd>
                            </dl>
                        )}
                    </div>
                    <div className='py-2'>
                        <dl className='flex items-center justify-between gap-4'>
                            <dt className='text-base font-normal text-gray-300'>Total</dt>
                            <dd className='text-base font-medium text-emerald-400'>${formattedTotal}</dd>
                        </dl>
                    </div>
                </div>
                <motion.button className='flex w-full items-center justify-center bg-emerald-600  text-white px-4 py-2 rounded-md
                text-sm font-medium  hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300'
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePayment}>
                    Proceed to Checkout
                </motion.button>
                <div className="flex justify-center">
                    <span className='text-sm text-gray-400 px-4 py-2'>Or continue <Link to={'/'} className='
                            text-emerald-400 hover:text-emerald-300 transition duration-300 ease-in-out'>  shopping?<ArrowRight className='
                            inline-block h-5'/></Link>
                    </span>
                </div>
            </div>
        </motion.div>
    )
}

export default OrderSummary