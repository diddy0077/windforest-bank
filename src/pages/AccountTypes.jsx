import React from 'react'
import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'

const AccountTypes = () => {
  const [accountTypes, setAccountsTypes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)


  useEffect(() => {
   window.scrollTo({top: 0, behavior: 'smooth'})
  }, [])
  
  useEffect(() => {
    setLoading(true)
    const fetchAccounts = async () => {
      try {
        const res = await fetch('http://localhost:5000/accountTypes')
      if (!res.ok) {
        throw {
          message: 'Error fetching accounts'
        }
      }
      const data = await res.json()
        console.log(data)
        setTimeout(() => {
          setAccountsTypes(data)
          setLoading(false)
        },2000)
      }
      catch (error) {
        console.log(error)
        setError(error)
      }
    }
    fetchAccounts()
  }, [])
  
  function Icons(account) {
    if (account.name === 'Checking Account') {
      return  <div className="mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-20 w-20 text-red-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 12h-6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2z"></path>
              <path d="M2 16h6a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2z"></path>
              <path d="M12 22h6a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2z"></path>
            </svg>
          </div>
    } else if (account.name === 'Savings Account') {
      return <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z"></path>
                <path d="M12 8v4l3 3"></path>
              </svg>
    } else if (account.name === 'High-Yield Savings') {
       return                <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <path d="M12 17V7m-3 5h6" />
                  <path d="M12 7a2.5 2.5 0 0 1 0 5 2.5 2.5 0 0 0 0 5" />
              </svg>
    } else if (account.name === 'Business Checking' || account.name === 'Business Savings') {
      return <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="15" height="15" rx="2" ry="2" />
                <path d="M17 12h-2" />
                <path d="M17 16h-2" />
                <path d="M17 20h-2" />
                <path d="M7 2h15v15" />
                <path d="M15 12h2" />
              </svg>
    } else if (account.name === 'Credit Card Account') {
      return <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                <line x1="1" y1="10" x2="23" y2="10"></line>
                <line x1="6" y1="14" x2="10" y2="14"></line>
                <line x1="18" y1="14" x2="18" y2="14"></line>
                <line x1="6" y1="18" x2="8" y2="18"></line>
              </svg>
    }
  }

  if (loading) {
    return <div className='flex items-center justify-center h-screen'>
      <div className='w-15 h-15 border-5 border-red-600 border-t-transparent rounded-full animate-spin'></div>
    </div>
  }

  return (
    <div className="bg-gray-100 text-gray-900 min-h-screen font-sans antialiased">
      {/* Main Content Section */}
      <main className="container mx-auto px-6 py-16 md:py-24">
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl md:text-5xl font-bold text-red-800">Choose Your Account</h1>
          <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Find the perfect account for your financial needs, from everyday banking to long-term savings.
          </p>
        </div>

        {/* Account Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {accountTypes.map((account) => {
            return (
              <div
          key={account.id}
          className="bg-white rounded-3xl shadow-xl p-8 flex flex-col items-center text-center transition-transform duration-300 hover:scale-105"
        >
          {/* Icon (keep static or swap per account type later) */}
          <div className="mb-6">
            {Icons(account)}
          </div>

          {/* Account Name */}
          <h3 className="text-xl md:text-2xl font-bold mb-2">{account.name}</h3>

          {/* Description */}
          <p className="text-gray-600 mb-6">{account.description}</p>

          {/* Features (optional preview, first 2 only) */}
          <ul className="text-gray-500 text-sm mb-6">
            {account.features.slice(0, 2).map((feat, idx) => (
              <li key={idx}>• {feat}</li>
            ))}
          </ul>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <Link to={`/open-account/${account.name}`} className="w-full py-3 bg-red-700 text-white font-semibold rounded-full shadow-md hover:bg-red-800 transition-colors">
              Open Now
            </Link>
            <Link className="w-full py-3 border border-gray-400 text-gray-700 font-semibold rounded-full hover:bg-gray-200 transition-colors">
              Learn More
            </Link>
          </div>
        </div>
           )
         })}
        

        </div>
      </main>

    </div>
  )
}

export default AccountTypes