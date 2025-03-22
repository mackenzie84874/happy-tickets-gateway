
import React from "react";
import { Link } from "react-router-dom";
import TicketForm from "@/components/TicketForm";
import { ArrowLeft, HelpCircle } from "lucide-react";

const SubmitTicket: React.FC = () => {
  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-blue-50/50 to-white">
      <div className="container px-4 sm:px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-4 group">
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Home
            </Link>
            
            <h1 className="text-3xl font-bold mb-3 text-balance">Submit a Support Ticket</h1>
            <p className="text-muted-foreground text-balance">
              Fill out the form below to create a new support ticket. We'll get back to you as soon as possible.
            </p>
          </div>
          
          <div className="bg-card border rounded-lg p-6 md:p-8 shadow-sm">
            <TicketForm />
          </div>
          
          <div className="mt-10 p-6 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-start gap-3">
              <HelpCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-lg mb-2">Need immediate assistance?</h3>
                <p className="text-muted-foreground mb-0">
                  For urgent issues, please check our <Link to="#" className="text-primary hover:text-primary/80 underline">FAQ section</Link> for 
                  quick answers to common questions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitTicket;
