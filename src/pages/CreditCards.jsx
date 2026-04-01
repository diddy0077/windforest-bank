import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const CreditCards = () => {
  const [creditCards, setCreditCards] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.title = "Credit Cards | WindForest Capital";
  }, []);

  useEffect(() => {
    setLoading(true);
    const fetchCreditCards = async () => {
      try {
        const res = await fetch(
          "https://windforest.capital/api/accountTypes"
        );
        if (!res.ok) {
          throw {
            message: "Error fetching credit cards",
          };
        }
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const data = await res.json();
        const creditCardAccounts = data.filter((acc) => {
          return acc.name.toLowerCase().includes("credit card");
        });
        setCreditCards(creditCardAccounts);
      } catch (error) {
        console.log("Error fetching credit cards", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCreditCards();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-15 h-15 border border-red-600 animate-spin border-t-transparent border-5 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 py-12 container mx-auto">
      <h1 className="font-bold text-4xl text-center my-20 md:mt-10 mt-5">
        Explore Our Credit Cards Accounts
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {creditCards.map((account) => {
          return (
            <div
              key={account.id}
              className="bg-white rounded-3xl shadow-xl p-8 flex flex-col items-center text-center transition-transform duration-300 hover:scale-105"
            >
              {/* Icon (keep static or swap per account type later) */}
              <div className="mb-6">
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
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
          <line x1="1" y1="10" x2="23" y2="10"></line>
          <line x1="6" y1="14" x2="10" y2="14"></line>
          <line x1="18" y1="14" x2="18" y2="14"></line>
          <line x1="6" y1="18" x2="8" y2="18"></line>
        </svg>
              </div>

              {/* Account Name */}
              <h3 className="text-xl md:text-2xl font-bold mb-2">
                {account.name}
              </h3>

              {/* Description */}
              <p className="text-gray-600 mb-6">{account.description}</p>

              {/* Features (optional preview, first 2 only) */}
              <ul className="text-gray-500 text-sm mb-6">
                {account?.features?.map((feat, idx) => (
                  <li key={idx}>• {feat}</li>
                ))}
              </ul>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <Link
                  to={`/open-account/${account.name}`}
                  className="w-full py-3 bg-red-700 text-white font-semibold rounded-full shadow-md hover:bg-red-800 transition-colors"
                >
                  Open Now
                </Link>
                <Link
                  to="/learn-more"
                  className="w-full py-3 border border-gray-400 text-gray-700 font-semibold rounded-full hover:bg-gray-200 transition-colors"
                >
                  Learn More
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CreditCards;
