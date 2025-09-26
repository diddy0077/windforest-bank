
import { Link } from 'react-router-dom';
import React, { useState, useContext } from 'react';
import { UserContext } from './UserContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { currentUser } = useContext(UserContext);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
      <nav className="w-full z-20 bg-white bg-opacity-90 backdrop-blur-sm border-b border-gray-200 shadow-sm sticky top-0">
          <div className="container px-6 mx-auto py-4 flex justify-between items-center">
            <div className="flex items-center space-x-8">
              <Link to='/' className="text-xl font-bold text-red-700">WindForest Bank</Link>
              <ul className="hidden md:flex space-x-6">
                <li className="font-semibold text-gray-700 hover:text-red-700 transition-colors cursor-pointer">
                  ATMs/Locations
                </li>
                <li className="font-semibold text-gray-700 hover:text-red-700 transition-colors cursor-pointer">
                  Help
                </li>
                <li className="font-semibold text-gray-700 hover:text-red-700 transition-colors cursor-pointer">
                  Español
                </li>
              </ul>
            </div>
            <div className="flex items-center">
              <div className='flex gap-4'>
                 {!currentUser && <button className="px-6 py-2 border border-red-600 text-red-600 font-semibold rounded-full hover:bg-red-600 hover:text-white transition-colors shadow-md hidden md:block whitespace-nowrap cursor-pointer">
                Sign On
              </button>}
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
              <li className="font-semibold text-gray-700 hover:text-red-700 transition-colors cursor-pointer">
                ATMs/Locations
              </li>
              <li className="font-semibold text-gray-700 hover:text-red-700 transition-colors cursor-pointer">
                Help
              </li>
              <li className="font-semibold text-gray-700 hover:text-red-700 transition-colors cursor-pointer">
                Español
              </li>
              <button className="w-full text-left px-6 py-2 border border-red-600 text-red-600 font-semibold rounded-full hover:bg-red-600 hover:text-white transition-colors shadow-md mt-2">
                Sign On
              </button>
              <Link to="/account-types" className="px-6 py-2 border bg-red-600 border-red-600 text-white font-semibold rounded-full hover:bg-white hover:text-red-600 transition-colors shadow-md hidden md:block whitespace-nowrap cursor-pointer">
                Open an Account
              </Link>
            </ul>
          </div>
          <div className="bg-white border-b border-gray-200 py-2 shadow-sm">
            <div className="container mx-auto px-6">
              <ul className="flex space-x-8 text-sm overflow-x-auto whitespace-nowrap md:justify-center">
                <li className="py-2 border-b-2 border-transparent hover:border-red-600 transition-colors font-semibold text-gray-700 cursor-pointer">
                  Checking
                </li>
                <li className="py-2 border-b-2 border-transparent hover:border-red-600 transition-colors font-semibold text-gray-700 cursor-pointer">
                  Savings & CDs
                </li>
                <li className="py-2 border-b-2 border-transparent hover:border-red-600 transition-colors font-semibold text-gray-700 cursor-pointer">
                  Credit Cards
                </li>
                <li className="py-2 border-b-2 border-transparent hover:border-red-600 transition-colors font-semibold text-gray-700 cursor-pointer">
                  Home Loans
                </li>
                <li className="py-2 border-b-2 border-transparent hover:border-red-600 transition-colors font-semibold text-gray-700 cursor-pointer">
                  Personal Loans
                </li>
              </ul>
            </div>
          </div>
        </nav>
  )
}

export default Navbar