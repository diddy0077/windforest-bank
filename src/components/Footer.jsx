import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div>
      <footer className="bg-gray-800 text-gray-300 py-12 ">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold text-white mb-4">WIND FOREST BANK</h3>
              <p className="text-sm">© 2025 Wind Forest Bank. All rights reserved.</p>
            </div>
            <div>
              <h4 className="text-md font-semibold text-white mb-2">Accounts</h4>
              <ul className="space-y-1 text-sm">
                <li>
                  <Link to="checking" className="hover:text-red-400">
                    Checking
                  </Link>
                </li>
                <li>
                  <Link to="savings" className="hover:text-red-400">
                    Savings
                  </Link>
                </li>
                <li>
                  <Link to="loans" className="hover:text-red-400">
                    Loans
                  </Link>
                </li>
                <li>
                  <Link to="account-types" className="hover:text-red-400">
                    Business
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-md font-semibold text-white mb-2">Support</h4>
              <ul className="space-y-1 text-sm">
                <li>
                  <Link to="help-center" className="hover:text-red-400">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link to="" className="hover:text-red-400">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="atm-locations" className="hover:text-red-400">
                    ATMs & Locations
                  </Link>
                </li>
                <li>
                  <Link to="" className="hover:text-red-400">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-md font-semibold text-white mb-2">Company</h4>
              <ul className="space-y-1 text-sm">
                <li>
                  <Link to="/about-us" className="hover:text-red-400">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="" className="hover:text-red-400">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link to="" className="hover:text-red-400">
                    Press
                  </Link>
                </li>
                <li>
                  <Link to="terms-of-service" className="hover:text-red-400">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Footer