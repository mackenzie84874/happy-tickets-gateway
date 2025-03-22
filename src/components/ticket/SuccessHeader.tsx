
import React from "react";

const SuccessHeader: React.FC = () => {
  return (
    <div className="mb-6 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="32" 
          height="32" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="text-green-600"
        >
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>
      
      <h1 className="text-2xl font-bold mb-3">Ticket Submitted Successfully</h1>
      <p className="text-muted-foreground">
        Thank you for submitting your ticket. We've received your request and will respond as soon as possible.
      </p>
    </div>
  );
};

export default SuccessHeader;
