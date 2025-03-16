import { useEffect } from 'react'
import { Navigate,Routes, Route, } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SignUpPage from './pages/SignUpPage.jsx'
import Navbar from './components/Navbar.jsx'
import { Toaster } from 'react-hot-toast'
import { useUserStore } from './stores/useUserStore.js'
import Spinner from './components/Spinner.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import CategoryPage from './pages/CategoryPage.jsx'
import { useCartStore } from './stores/useCartStore.js'
import CartPage from './pages/CartPage.jsx'
import PurchaseSuccessPage from './pages/PurchaseSuccessPage.jsx'
import PurchaseCancelPage from './pages/PurchaseCancelPage.jsx'



const App = () => {
  const { user, checkAuth, checkingAuth, logOut } = useUserStore()
  const { getCartItems } = useCartStore()
  useEffect(() => {
    checkAuth()
  }, [checkAuth])
  useEffect(() => {
    if (user) {
      getCartItems()
    }
  }, [getCartItems, user])
  if (checkingAuth) return <Spinner />
  return (
    <div className='min-h-screen bg-gray-900 text-white overflow-hidden relative'>
      {/* Background gradient */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute inset-0'>
          <div className='absolute top-0 left-1/2 -translate-x-1/2 w-full h-full 
          bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)]' />
        </div>
      </div>
      <div className="relative z-50 pt-20">
        <Navbar user={user} logOut={logOut} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={!user ? <SignUpPage /> : <Navigate to='/' />} />
          <Route path="/login" element={!user ? <LoginPage /> : <Navigate to='/' />} />
          <Route
            path='/secret-dashboard'
            element={user?.role === "admin" ? <AdminDashboard /> : <Navigate to='/login' />}
          />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/cart" element={user ? <CartPage /> : <Navigate to='/login' />} />
          <Route path="/purchase-success" element={<PurchaseSuccessPage />  } />
          <Route path="/purchase-cancel" element={<PurchaseCancelPage /> } />
        </Routes>
      </div>
      <Toaster />
    </div>
  )
}

export default App