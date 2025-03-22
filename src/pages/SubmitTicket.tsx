
import React from "react";
import { Link } from "react-router-dom";
import TicketForm from "@/components/TicketForm";

const SubmitTicket: React.FC = () => {
  return (
    <div className="min-h-screen pt-20">
      <div className="container px-4 sm:px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground flex items-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
              Back to Home
            </Link>
            
            <h1 className="text-3xl font-bold mb-3">Submit a Support Ticket</h1>
            <p className="text-muted-foreground">
              Fill out the form below to create a new support ticket. We'll get back to you as soon as possible.
            </p>
          </div>
          
          <div className="bg-card border rounded-lg p-6 md:p-8 shadow-sm">
            <TicketForm />
          </div>
          
          <div className="mt-10 p-6 bg-blue-50 rounded-lg border border-blue-100">
            <h3 className="font-medium text-lg mb-2">Need immediate assistance?</h3>
            <p className="text-muted-foreground mb-0">
              For urgent issues, please check our <Link to="#" className="text-primary hover:text-primary/80 underline">FAQ section</Link> for 
              quick answers to common questions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitTicket;
