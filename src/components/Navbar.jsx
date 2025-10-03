
import { Link,useLocation,useNavigate,NavLink } from 'react-router-dom';
import React, { useState, useContext, use } from 'react';
import { UserContext } from './UserContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { currentUser } = useContext(UserContext);
  const location = useLocation();
  const nav = useNavigate();
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const handleSignOn = () => {
     if(location.pathname !== "/") {
       nav('/')
     } 
  };

  return (
      <nav className="w-full z-20 bg-white bg-opacity-90 backdrop-blur-sm border-b border-gray-200 shadow-sm sticky top-0">
          <div className="container px-6 mx-auto py-4 flex justify-between items-center">
            <div className="flex items-center space-x-8">
              <Link to='/' className="text-xl font-bold text-red-700">WindForest Bank</Link>
              <ul className="hidden md:flex space-x-6">
                <Link to='atm-locations' className="font-semibold text-gray-700 hover:text-red-700 transition-colors cursor-pointer">
                  ATMs/Locations
                </Link>
                <Link to="/help-center" className="font-semibold text-gray-700 hover:text-red-700 transition-colors cursor-pointer">
                  Help
                </Link>
              </ul>
            </div>
            <div className="flex items-center">
              <div className='flex gap-4'>
                 <button onClick={handleSignOn} className="px-6 py-2 border border-red-600 text-red-600 font-semibold rounded-full hover:bg-red-600 hover:text-white transition-colors shadow-md hidden md:block whitespace-nowrap cursor-pointer">
                Sign On
              </button>
              <Link to="/account-types" className="px-6 py-2 border bg-red-600 border-red-600 text-white font-semibold rounded-full hover:bg-white hover:text-red-600 transition-colors shadow-md hidden md:block whitespace-nowrap cursor-pointer">
                Open an Account
              </Link>
             </div>
              <button onClick={toggleMenu} className="text-gray-700 md:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                  )}
                </svg>
              </button>
            </div>
          </div>
          {/* Mobile Menu */}
          <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
            <ul className="flex flex-col items-start px-6 pb-4 space-y-2">
              <Link to="atm-locations" className="font-semibold text-gray-700 hover:text-red-700 transition-colors cursor-pointer">
                ATMs/Locations
              </Link>
              <Link to="" className="font-semibold text-gray-700 hover:text-red-700 transition-colors cursor-pointer">
                Help
              </Link>
              <div className='w-full flex flex-col gap-2 mt-2'>
               <button onClick={handleSignOn} className="w-full text-left px-6 py-2 border border-red-600 text-red-600 font-semibold rounded-full hover:bg-red-600 hover:text-white transition-colors shadow-md mt-2">
                Sign On
              </button>
              <Link to="/account-types" className="px-6 py-2 border bg-red-600 border-red-600 text-white font-semibold rounded-full hover:bg-white hover:text-red-600 transition-colors shadow-md md:block whitespace-nowrap cursor-pointer">
                Open an Account
              </Link>
              </div>
            </ul>
          </div>
          <div className="bg-white border-b border-gray-200 py-2 shadow-sm">
            <div className="container mx-auto px-6">
              <ul className="flex space-x-8 text-sm overflow-x-auto whitespace-nowrap md:justify-center">
                <NavLink to='/checking' className={({ isActive }) => isActive ? 'py-2 border-b-4 border-red-600 transition-colors font-semibold text-gray-700 cursor-pointer' : 'py-2 border-b-2 border-transparent hover:border-red-600 transition-colors font-semibold text-gray-700 cursor-pointer'}>
                  Checking
                </NavLink>
                <NavLink to='/savings' className={({ isActive }) => isActive ? 'py-2 border-b-4 border-red-600 transition-colors font-semibold text-gray-700 cursor-pointer' : 'py-2 border-b-2 border-transparent hover:border-red-600 transition-colors font-semibold text-gray-700 cursor-pointer'}>
                  Savings & CDs
                </NavLink>
                <NavLink to='account-types' className={({ isActive }) => isActive ? 'py-2 border-b-4 border-red-600 transition-colors font-semibold text-gray-700 cursor-pointer' : 'py-2 border-b-2 border-transparent hover:border-red-600 transition-colors font-semibold text-gray-700 cursor-pointer'}>
                  Credit Cards
                </NavLink>
                <NavLink to='/loans' className={({ isActive }) => isActive ? 'py-2 border-b-4 border-red-600 transition-colors font-semibold text-gray-700 cursor-pointer' : 'py-2 border-b-2 border-transparent hover:border-red-600 transition-colors font-semibold text-gray-700 cursor-pointer'}>
                  Loan Products
                </NavLink>
              </ul>
            </div>
          </div>
        </nav>
  )
}

export default Navbar