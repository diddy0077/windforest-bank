import React, { useState,useEffect } from 'react';

// Mock location data
const mockLocations = [
  { id: 1, name: "Main Headquarters Branch", address: "123 Wind Forest Lane, Anytown, CA 90210", services: ["ATM", "Full-Service Branch", "Drive-Thru"], distance: "0.8 mi", mapLink: "#" },
  { id: 2, name: "Riverbend ATM Pod", address: "456 Oak Street, Suite 100, Anytown, CA 90210", services: ["ATM", "Deposit"], distance: "2.1 mi", mapLink: "#" },
  { id: 3, name: "Eastgate Retail Center Branch", address: "789 Pine Ave, Anytown, CA 90210", services: ["ATM", "Full-Service Branch"], distance: "3.5 mi", mapLink: "#" },
  { id: 4, name: "Midtown 24/7 ATM", address: "303 Commerce Blvd, Anytown, CA 90210", services: ["ATM"], distance: "4.0 mi", mapLink: "#" },
];

/**
 * Custom SVG Icons (Simulating Lucide Icons)
 */
const MapPinIcon = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const SearchIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const GlobeIcon = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a15.3 15.3 0 0 0 4 10 15.3 15.3 0 0 0-4 10 15.3 15.3 0 0 0-4-10 15.3 15.3 0 0 0 4-10z" />
    <path d="M2 12h20" />
  </svg>
);


/**
 * Location Card Component
 */
const LocationCard = ({ location }) => {
  // Determine if the location is a full branch or just an ATM
  const isBranch = location.services.includes("Full-Service Branch");

  return (
    <div className="flex bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200">
      
      {/* Left Accent (Red-600) */}
      <div className={`w-2 ${isBranch ? 'bg-red-600' : 'bg-gray-400'} flex-shrink-0`}></div>
      
      <div className="p-5 sm:p-6 flex-grow">
        <div className="flex justify-between items-start">
          <div>
            {/* Title (Dark Gray/Red Accent) */}
            <h3 className="text-xl font-bold text-gray-900">
              {location.name}
            </h3>
            {/* Address (Medium Gray) */}
            <p className="text-sm text-gray-500 mt-1">{location.address}</p>
          </div>
          {/* Distance */}
          <div className="text-right flex-shrink-0 ml-4">
            <span className="text-2xl font-extrabold text-red-600 block leading-none">
              {location.distance}
            </span>
            <span className="text-xs text-gray-500 block">away</span>
          </div>
        </div>
        
        {/* Services Badges */}
        <div className="mt-3 flex flex-wrap gap-2">
          {location.services.map(service => (
            <span 
              key={service} 
              className={`text-xs font-semibold px-3 py-1 rounded-full ${
                service.includes("Branch") ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {service}
            </span>
          ))}
        </div>

        {/* Action Button (Red-600) */}
        <div className="mt-5">
          <a
            href={location.mapLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150"
          >
            <MapPinIcon className="w-4 h-4 mr-2" />
            View Directions
          </a>
        </div>
      </div>
    </div>
  );
};


/**
 * Main ATMs & Locations Page Component
 */
const Atm = () => {
  const [searchTerm, setSearchTerm] = useState('');
    useEffect(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);



  // Filter mock data based on search term (simple case-insensitive match)
  const filteredLocations = mockLocations.filter(loc => 
    loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loc.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (e) => {
    e.preventDefault();
    // Search logic is handled by state update above
    console.log(`Searching for: ${searchTerm}`);
  };

  return (
    // Light Theme Background: Very light gray (or white)
    <div className="min-h-screen bg-gray-50 font-inter p-4 sm:p-8">
      
      {/* Header Section */}
      <header className="max-w-4xl mx-auto py-6 border-b border-gray-200 mb-8">
        <div className="flex items-center text-red-600 mb-2">
            <GlobeIcon className="w-8 h-8 mr-3" />
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                ATMs & Locations
            </h1>
        </div>
        <p className="mt-2 text-lg text-gray-600">
            Find a Wind Forest Bank branch or ATM near you.
        </p>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto">
        
        {/* Search Bar Section */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-100">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            
            {/* Input Field (Gray/White theme) */}
            <input
              type="text"
              placeholder="Enter City, State, or Zip Code"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow px-5 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 transition duration-150 text-gray-800"
            />
            
            {/* Search Button (Red-600) */}
            <button
              type="submit"
              className="flex items-center justify-center sm:w-auto w-full px-6 py-3 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-200"
            >
              <SearchIcon className="w-5 h-5 mr-2" />
              Search
            </button>
          </form>
          <p className="text-sm text-gray-500 mt-3">
              We have over 500 in-network ATMs nationwide.
          </p>
        </div>

        {/* Results Section */}
        <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-5 border-b pb-2 border-red-100">
                {filteredLocations.length} Locations Found
            </h2>
          
            <div className="space-y-6">
                {filteredLocations.length > 0 ? (
                    filteredLocations.map(location => (
                        <LocationCard key={location.id} location={location} />
                    ))
                ) : (
                    <div className="p-10 text-center bg-white rounded-xl border border-dashed border-gray-300">
                        <p className="text-gray-600 font-medium">No locations match your search term "{searchTerm}".</p>
                        <p className="text-sm text-gray-400 mt-1">Try a different city or zip code.</p>
                    </div>
                )}
            </div>
        </div>
      </main>
      
    </div>
  );
};

export default Atm;
