import React from 'react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { PlusCircle, Upload, Loader, Check } from 'lucide-react'
import { useProductStore } from '../stores/useProductStore'
import { toast } from 'react-hot-toast'


const categories = ['jeans', 't-shirts', 'shoes', 'glasses', 'jackets', 'bags', 'suits']
const CreateProduct = () => {
    const { createProduct, loading } = useProductStore()
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await createProduct(newProduct)
            setNewProduct({
                name: '',
                description: '',
                price: '',
                quantity: '',
                category: '',
                image: ''
            })
        } catch (error) {
            toast.error(error.message)
        }

    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = () => {
                setNewProduct({ ...newProduct, image: reader.result })
            }
            reader.readAsDataURL(file) //base64
        }
    }

    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        price: '',
        quantity: '',
        category: '',
        image: '',
    })

    return (
        <motion.div
            className='bg-gray-800 shadow-lg rounded-lg p-8 mb-8 max-w-xl mx-auto'
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .8, delay: .2 }}>
            <h2 className='text-2xl font-bold text-emerald-400 mb-4 text-center'>Create New Product</h2>
            <form onSubmit={handleSubmit} className='space-y-4'>
                <div>
                    <label htmlFor="name" className='block text-sm font-medium text-gray-400'>
                        Product Name
                    </label>
                    <input type="text"
                        id='name'
                        name='name'
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        className='mt-1 block w-full rounded-md border-gray-600 bg-gray-700 shadow-sm py-2 px-3 focus:ring-2
                        focus:ring-emerald-500 focus:outline-none focus:border-emerald-500'
                        required />
                </div>
                <div>
                    <label htmlFor="description" className='block text-sm font-medium text-gray-400'>
                        Product Description
                    </label>
                    <textarea
                        id='description'
                        name='description'
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        className='mt-1 block w-full rounded-md border-gray-600 bg-gray-700 shadow-sm py-2 px-3 focus:ring-2
                        focus:ring-emerald-500 focus:outline-none focus:border-emerald-500'
                        required />
                </div>
                <div>
                    <label htmlFor="price" className='block text-sm font-medium text-gray-400'>
                        Price
                    </label>
                    <input type="number"
                        id='price'
                        name='price'
                        step={.5}
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        className='mt-1 block w-full rounded-md border-gray-600 bg-gray-700 shadow-sm py-2 px-3 focus:ring-2
                        focus:ring-emerald-500 focus:outline-none focus:border-emerald-500'
                        required />
                </div>
                <div>
                    <label htmlFor="quantity" className='block text-sm font-medium text-gray-400'>
                        Quantity
                    </label>
                    <input type="number"
                        id='quantity'
                        name='quantity'
                        step={5}
                        value={newProduct.quantity}
                        onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                        className='mt-1 block w-full rounded-md border-gray-600 bg-gray-700 shadow-sm py-2 px-3 focus:ring-2
                        focus:ring-emerald-500 focus:outline-none focus:border-emerald-500'
                        required />
                </div>
                <div >
                    <label htmlFor="category" className='block text-sm font-medium text-gray-400'>
                        Category
                    </label>
                    <select
                        id='category'
                        name='category'
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                        className='mt-1 block w-full rounded-md border-gray-600 bg-gray-700 shadow-sm py-2 px-3 focus:ring-2
                        focus:ring-emerald-500 focus:outline-none focus:border-emerald-500 '
                        required >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>
                <div className=" mt-1 flex items-center">
                    <input type="file" id='image' onChange={handleImageChange} className='sr-only' accept='image/*' />
                    <label htmlFor="image"
                        className='cursor-pointer bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md font-medium
                     border border-gray-600 shadow-sm leading-4 focus:ring-2 focus:ring-emerald-500 focus:outline-none focus:ring-offset'>
                        <Upload className='w-6 h-6 inline-block' />
                        Upload Image
                    </label>
                    {newProduct.image && <span className='ml-2 text-sm text-gray-400'>image Uploaded <Check className='inline-block w-4 h-4' /></span>}
                </div>
                <button type='submit'
                    className='w-full flex justify-center py-2 px-4 borer border-transparent rounded-md shadow-sm text-sm font-medium
                             text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500
                             transition duration-300 ease-in-out disabled:opacity-50'
                    disabled={loading}>
                    {loading ? (
                        <>
                            <Loader className='mr-2 h-5 w-5 animate-spin' />
                            Loading...
                        </>
                    ) : (
                        <>
                            <PlusCircle className='ml-2 h-5 w-5 pr-1' />
                            Create Product
                        </>
                    )}
                </button>
            </form>
        </motion.div>
    )
}

export default CreateProduct