import React from 'react'
import { Outlet,useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

const Layout = () => {
  const location = useLocation();

  // List of routes where you don't want navbar
  const hideNavbarRoutes = ["/account-dashboard", '/account-dashboard/profile', '/account-dashboard/transfer', '/account-dashboard/transactions', '/account-dashboard/link-accounts', '/account-dashboard/my-loans', '/admin'];

  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      {!shouldHideNavbar  && <Navbar />}
      
      <main className="flex-grow">
        <Outlet />
      </main>
      
      {!shouldHideNavbar && <Footer />}
    </div>
  )
}

export default Layout
