import React, { useEffect } from 'react'
import CategoryItem from '../components/CategoryItem'
import { useProductStore } from '../stores/useProductStore';
import FeaturedProducts from '../components/FeaturedProducts';



const categories = [
    { href: '/jeans', name: 'Jeans', imageUrl: '/jeans.jpg' },
    { href: '/t-shirts', name: 'T-shirt', imageUrl: '/tshirts.jpg' },
    { href: '/shoes', name: 'Shoes', imageUrl: '/shoes.jpg' },
    { href: '/bags', name: 'Bags', imageUrl: '/bags.jpg' },
    { href: '/jackets', name: 'Jackets', imageUrl: '/jackets.jpg' },
    { href: '/glasses', name: 'Glasses', imageUrl: '/glasses.png' },
    { href: '/suits', name: 'Suits', imageUrl: '/suits.jpg' },
]
const HomePage = () => {
    const {fetchFeaturedProducts, products ,isLoading} = useProductStore();

    useEffect(() => {
        fetchFeaturedProducts();
    }, [fetchFeaturedProducts]);
    return (
        <div className='relative min-h-screen text-white overflow-hidden'>
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h1 className='text-5xl text-emerald-600 font-bold text-center mb-4'>Explore Our Categories</h1>
                <p className='text-center text-xl mb-12 text-gray-400'>
                    Discover latest trends and styles with our wide range of products.
                </p>
                <div className="grid grid-col-1 sm:grid-col-2 lg:grid-cols-3 gap-4">
                    {categories.map(category => (
                        <CategoryItem
                            category={category}
                            key={category.name} />
                    )
                    )}
                </div>
                {!isLoading && products?.length > 0 && (
                    <FeaturedProducts featuredProducts={products} />
                )}
            </div>
        </div>
    )
}

export default HomePage