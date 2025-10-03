import React,{useEffect} from "react";
import { useParams,Link } from "react-router-dom";
import { categories } from "../pages/Help";


const HelpDetails = () => {
  const {slug} = useParams();
   const selectedCategory = categories.find((c) => c.slug === slug)
 
  useEffect(() => {
    console.log(slug);
  },[slug])

  return (
  
    <div className="min-h-screen bg-gray-50 flex justify-center p-4 sm:p-8 font-inter">
      
      <div className="w-full max-w-4xl bg-white p-6 sm:p-10 md:p-12 rounded-2xl shadow-2xl border border-gray-100">
        
        <div className="border-b border-gray-200 pb-6 mb-8">
          
          <Link 
            to="/help-center"
            className="inline-flex items-center text-red-600 hover:text-red-700 font-medium transition duration-150 mb-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
            Back to Help Center
          </Link>

          {/* Title Block */}
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-full bg-red-600 text-white flex-shrink-0">
                {selectedCategory.Icon && <selectedCategory.Icon className="w-6 h-6" />}
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
                {selectedCategory.title}
              </h1>
              <p className="mt-1 text-lg text-gray-600">
                {selectedCategory.description}
              </p>
            </div>
          </div>
        </div>
        
        {/* Article Body (Rendered from HTML string) */}
        <article className="prose max-w-none">
          <div 
            // DANGER: Using dangerouslySetInnerHTML is required here to render the HTML string content.
            // Ensure that 'content' is sanitized if it comes from user input.
            dangerouslySetInnerHTML={{ __html: selectedCategory.content }} 
          />
        </article>

        {/* Footer Action Card */}
        <div className="mt-10 p-6 bg-red-50 border border-red-200 rounded-xl flex flex-col sm:flex-row items-center justify-between shadow-inner">
          <p className="text-lg font-semibold text-red-800 mb-4 sm:mb-0">
            Couldn't find what you needed? We're here to help.
          </p>
          <Link
            to="/contact" // Link to a dedicated contact page
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-semibold rounded-lg shadow-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 w-full sm:w-auto justify-center"
          >
            Contact Support
          </Link>
        </div>

      </div>
      
    </div>
  );
};

export default HelpDetails;
