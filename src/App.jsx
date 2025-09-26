import React from 'react'
import HomePage from './pages/HomePage'
import AccountTypes from './pages/AccountTypes'
import Layout from './components/Layout'
import { createBrowserRouter,createRoutesFromElements,Route,RouterProvider } from 'react-router-dom'
import OpenAccount from './pages/AccountOpening'
import OnlineEnrollment from './pages/OnlineEnrollment'
import AccountDashboard from './components/AccountDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import Transactions from './components/Transactions'
import Transfer from './components/Transfer'
import Profile from './components/Profile'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ForgotPassword from './pages/ForgotPassword'
import About from './pages/About'

const App = () => {
 

 const router = createBrowserRouter(
   createRoutesFromElements(
     <Route path="/" element={<Layout />}>
       <Route index element={<HomePage />} />
       <Route path="account-types" element={<AccountTypes />} />
       <Route path="open-account/:name" element={<OpenAccount />} />
       <Route path="online-enrollment" element={<OnlineEnrollment />} />
       <Route path="about-us" element={<About/>} />
       <Route path='account-dashboard' element={<ProtectedRoute/>}>
         <Route index element={<AccountDashboard />} />
         <Route path='transactions' element={<Transactions />} />
         <Route path='transfer' element={<Transfer />} />
         <Route path='profile' element={<Profile />} />
       </Route>
       <Route path='forgot-password' element={<ForgotPassword/>}/>
     </Route>
   )
 );

  return (
    <div className='bg-gray-100'>
      <RouterProvider router={router} />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  )
}

export default App