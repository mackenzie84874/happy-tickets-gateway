
import React from "react";
import { Link } from "react-router-dom";

const TicketSubmitted: React.FC = () => {
  return (
    <div className="min-h-screen pt-20 flex items-center justify-center">
      <div className="container px-4 sm:px-6 py-12">
        <div className="max-w-md mx-auto text-center bg-white rounded-lg border p-8 shadow-sm animate-scale-in">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold mb-3">Ticket Submitted Successfully</h1>
          <p className="text-muted-foreground mb-6">
            Thank you for submitting your ticket. We've received your request and will respond as soon as possible.
          </p>
          
          <div className="flex flex-col space-y-4">
            <Link
              to="/"
              className="py-2 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium transition-colors hover:bg-primary/90"
            >
              Return to Home
            </Link>
            
            <Link
              to="/submit-ticket"
              className="py-2 px-4 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium transition-colors hover:bg-secondary/80"
            >
              Submit Another Ticket
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketSubmitted;
