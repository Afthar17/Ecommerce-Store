import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import ProductCard from './ProductCard'
import axios from '../lib/axios'
import toast from 'react-hot-toast'
import Spinner from './Spinner'

const PeopleAlsoBought = () => {
    const [recomendation, setRecomendation] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchRecommendation = async () => {
            try {
                const res = await axios.get('/products/recomendations')
                setRecomendation(res.data)
            } catch (error) {
                toast.error(error.response.data.message || 'Something went wrong')
            }
            finally {
                setIsLoading(false)
            }
        }
        fetchRecommendation()
    }, [])
    if (isLoading) return <Spinner />
    return (
        <motion.div className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}>
            <h3 className='text-2xl font-semibold text-emerald-400 '>
                People also bought
            </h3>
            <div className="grid mt-6 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {recomendation.map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
        </motion.div>
    )
}

export default PeopleAlsoBought