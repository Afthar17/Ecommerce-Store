import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { UserPlus, Mail, Lock, User, ArrowRight, Loader, Eye } from 'lucide-react'
import { motion } from 'framer-motion'
import { useUserStore } from '../stores/useUserStore'
const SignUpPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    const { signUp, user, loading } = useUserStore()

    const [togglePassword, setTogglePassword] = useState(false)
    const [togglePassword2, setTogglePassword2] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        signUp(formData)
    }
    return (
        <div className=' flex flex-col justify-center py-10 sm:px-6 lg:px-8 space-y-4'>
            <motion.div
                className='sm:mx-auto sm:w-full sm:max-w-md'
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: .8, delay: 0.2 }}
            >
                <h2 className="mt-6 text-center text-3xl font-extrabold text-emerald-500">Create your account</h2>
            </motion.div>
            <motion.div
                className='sm:mx-auto sm:w-full sm:max-w-md'
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: .8, delay: 0.2 }}
            >
                <div className="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form onSubmit={handleSubmit} className='space-y-6'>
                        <div>
                            <label htmlFor="name" className='block text-sm font-medium leading-6 text-gray-400'>Full name</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5w-5text-gray-400" aria-hidden="true" />
                                </div>
                                <input type="text"
                                    id='name'
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className='block w-full rounded-md border border-gray-600 bg-gray-700 shadow-sm placeholder:text-gray-400 
                                    focus:ring-emerald-500 focus:outline-none sm:text-sm focus:border-emerald-500 px-3 py-2 pl-10 focus:bg-gray-600'
                                    placeholder='Enter your name ' />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="email" className='block text-sm font-medium leading-6 text-gray-400'>Email</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5w-5text-gray-400" aria-hidden="true" />
                                </div>
                                <input type="email"
                                    id='email'
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className='block w-full rounded-md border border-gray-600 bg-gray-700 shadow-sm placeholder:text-gray-400 
                                    focus:ring-emerald-500 focus:outline-none sm:text-sm pl-10 focus:border-emerald-500 px-3 py-2 focus:bg-gray-600'
                                    placeholder='Enter your email ' />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="password" className='block text-sm font-medium leading-6 text-gray-400'>Password</label>
                            <div className="mt-1 relative rounded-md shadow-sm ">
                                <div className="absolute inset-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5w-5text-gray-400" aria-hidden="true" />
                                </div>
                                <input type={togglePassword ? 'text' : 'password'}
                                    id='password'
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className='block w-full rounded-md border border-gray-600 bg-gray-700 shadow-sm placeholder:text-gray-400 
                                    focus:ring-emerald-500 focus:outline-none sm:text-sm focus:border-emerald-500 px-3 py-2 pl-10 focus:bg-gray-600'
                                    placeholder='Enter your password' />
                                <div className="absolute top-2 right-2 pl-3 flex items-center ">
                                    <button className='hover:cursor-pointer' onClick={(e) => {
                                        e.preventDefault()
                                        setTogglePassword(!togglePassword)
                                    }}>
                                        <Eye className="h-5w-5text-gray-400" aria-hidden="true" />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className='block text-sm font-medium leading-6 text-gray-400'>Confirm password</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5w-5text-gray-400" aria-hidden="true" />
                                </div>
                                <input type={togglePassword2 ? 'text' : 'password'}
                                    id='confirmPassword'
                                    required
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    className='block w-full rounded-md border border-gray-600 bg-gray-700 shadow-sm placeholder:text-gray-400 
                                    focus:ring-emerald-500 focus:outline-none sm:text-sm focus:border-emerald-500 px-3 py-2 pl-10 focus:bg-gray-600'
                                    placeholder='Re-Enter your password' />
                                <div className="absolute top-2 right-2 pl-3 flex items-center ">
                                    <button className='hover:cursor-pointer' onClick={(e) => {
                                        e.preventDefault()
                                        setTogglePassword2(!togglePassword2)
                                    }}>
                                        <Eye className="h-5w-5text-gray-400" aria-hidden="true" />
                                    </button>
                                </div>
                            </div>
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
                                    <UserPlus className='ml-2 h-5 w-5 pr-1' />
                                    Sign up
                                </>
                            )}
                        </button>
                    </form>
                </div>
                <div className="flex justify-center">
                    <span className='text-sm text-gray-400 px-4 py-4'>Already have an account?<Link to={'/login'} className='
                            text-emerald-400 hover:text-emerald-300 transition duration-300 ease-in-out'> Login here <ArrowRight className='
                            inline-block h-5'/></Link>
                    </span>
                </div>
            </motion.div>
        </div>
    )
}

export default SignUpPage