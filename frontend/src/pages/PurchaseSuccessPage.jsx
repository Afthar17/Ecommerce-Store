import { ArrowRight,  CheckCircle, HandHeart,} from "lucide-react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useCartStore } from "../stores/useCartStore"
import axios from "../lib/axios"
import Confetti from 'react-confetti'


const PurchaseSuccessPage = () => {
    const [processing, setProcessing] = useState(true)
    const [error, setError] = useState(null)
    const {clearCart} = useCartStore()
    useEffect(()=>{
        const handleCheckout = async (sessionId) => {
            try {
                await axios.post('/payments/checkout-success',{
                    sessionId
                })
                console.log('success')
                clearCart()
            } catch (error) {
                console.log(error)
            }finally{
                setProcessing(false)
                clearCart()
            }
        }
        const sessionId = new URLSearchParams(window.location.search).get('session_id')
        if(sessionId){
            handleCheckout(sessionId)
        }
        else{
            setProcessing(false)
            setError('No session id found')
        }
        return () => {
            clearCart()
        }
    },[clearCart])
    if(processing) return 'Processing....'
    if(error) return 'Something went wrong...'
  return (
    <div className="h-screen flex items-center justify-center px-4">
        <Confetti width={window.innerWidth} height={window.innerHeight} gravity={0.1} style={{zindex:999}} numberOfPieces={700} recycle={false} />
        <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl overflow-hidden relative z-10">
            <div className="p-6 sm:p-8">
                <div className="flex justify-center">
                    <CheckCircle className="text-emerald-400 w-16 h-16 mb-4" />
                </div>
                <h1 className="text-2xl font-bold text-center text-emerald-400">Purchase successful!</h1>
                <p className="mt-4 text-center text-gray-400 mb-4">
                    Thank you for your purchase!
                </p>
                <p className="mt-4 text-center text-gray-400 mb-4">
                    Check your email for the order details
                </p>
                <div className='bg-gray-700 rounded-lg p-4 mb-6'>
						<div className='flex items-center justify-between mb-2'>
							<span className='text-sm text-gray-400'>Order number</span>
							<span className='text-sm font-semibold text-emerald-400'>#12345</span>
						</div>
						<div className='flex items-center justify-between'>
							<span className='text-sm text-gray-400'>Estimated delivery</span>
							<span className='text-sm font-semibold text-emerald-400'>3-5 business days</span>
						</div>
					</div>

					<div className='space-y-4'>
						<button
							className='w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4
             rounded-lg transition duration-300 flex items-center justify-center'
						>
							<HandHeart className='mr-2' size={18} />
							Thanks for trusting us!
						</button>
						<Link
							to={"/"}
							className='w-full bg-gray-700 hover:bg-gray-600 text-emerald-400 font-bold py-2 px-4 
            rounded-lg transition duration-300 flex items-center justify-center'
						>
							Continue Shopping
							<ArrowRight className='ml-2' size={18} />
						</Link>
					</div>
            </div>
        </div>
    </div>
  )
}

export default PurchaseSuccessPage