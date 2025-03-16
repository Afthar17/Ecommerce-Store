import React from 'react'
import toast from 'react-hot-toast'
import { ShoppingCart } from 'lucide-react'
import { useUserStore } from '../stores/useUserStore'
import { useCartStore } from '../stores/useCartStore'

const ProductCard = ({ product }) => {
    const { user } = useUserStore()
    const { addToCart } = useCartStore()
    const handleAddToCart = () => {

        if (!user) {
            toast.error('You must be logged in to add to cart', { id: 'cart-toast' })
            return
        } else {
            addToCart(product)
        }
    }
    return (
        <div className='flex w-full relative flex-col overflow-hidden border rounded-lg border-gray-700 shadow-lg'>
            <div className="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl">
                <img src={product.image} className='object-cover w-full' />
                <div className='absolute inset-0 bg-black
                 bg-opacity-20' />
            </div>
            <div className="mt-4 px-5 pb-5">
                <h5 className="text-xl font-semibold text-gray-300 tracking-tight">{product.name}</h5>
                <div className="mt-2 mb-5 flex items-center justify-between">
                    <p>
                        <span className='text-3xl font-bold text-emerald-400'>${product.price}</span>
                    </p>
                </div>
                <button className='flex items-center justify-center bg-emerald-600  text-white px-4 py-2 rounded-md
                text-sm font-medium  hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300'
                    onClick={handleAddToCart}>
                    <ShoppingCart className='inline-block mr-2' sixe={22} />
                    Add to Cart
                </button>
            </div>
        </div>
    )
}

export default ProductCard