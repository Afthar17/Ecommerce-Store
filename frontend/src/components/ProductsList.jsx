import React from 'react'
import { motion } from 'framer-motion'
import { Trash2, Star } from 'lucide-react'
import { useProductStore } from '../stores/useProductStore'

const ProductsList = () => {
    const { deleteProduct, toggleFeaturedProduct, products } = useProductStore()
    return (
        <motion.div className='bg-gray-900 shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto'
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .8, delay: .2 }}>
            <table className='min-w-full divide-y divide-gray-700'>
                <thead className='bg-gray-700'>
                    <tr>
                        <th scope='col'
                            className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
                            Product
                        </th>
                        <th scope='col'
                            className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
                            Price
                        </th>
                        <th scope='col'
                            className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
                            Category
                        </th>
                        <th scope='col'
                            className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
                            InStock
                        </th>
                        <th scope='col'
                            className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
                            isFeatured
                        </th>
                        <th scope='col'
                            className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
                            Delete
                        </th>
                    </tr>
                </thead>
                <tbody className='bg-gray-800 divide-y divide-gray-700'>
                    {products.map((product) => (
                        <tr key={product._id} className='hover:bg-gray-700'>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex item-center">
                                    <div className="flex-shrink-0 h-10 w-10">
                                        <img src={product.image} alt={product.name}
                                            className='h-10 w-10 rounded-full object-cover' />
                                    </div>
                                    <div className="ml-4 mt-2">
                                        <div className="text-sm font-medium text-white">{product.name}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap ">
                                <div className="text-sm  text-gray-400 ml-3">{product.price}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap ">
                                <div className="text-sm  text-gray-400 ml-3">{product.category}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap ">
                                <div className="text-sm  text-gray-400 ml-3">{product.quantity}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap ">
                                <button onClick={() => toggleFeaturedProduct(product._id)}
                                    className={`${product.isFeatured ? 'bg-yellow-400 text-gray-700 ' : 'text-gray-400 bg-gray-600'} 
                                    p-1 rounded-full hover:bg-yellow-400 ml-4 transition-colors duration-200`}>
                                    <Star className='w-5 h-5' />
                                </button>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap font-medium">
                                <button onClick={() => deleteProduct(product._id)}
                                    className='text-red-400 hover:text-red-600 transition-colors duration-200 ml-3'>
                                    <Trash2 className='w-5 h-5' />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </motion.div>
    )
}

export default ProductsList