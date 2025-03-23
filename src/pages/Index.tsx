import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="container px-4 py-12 flex flex-col items-center text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Support Ticket System</h1>
          <p className="text-muted-foreground mb-8">
            Submit a ticket to get help from our support team. We'll respond as quickly as possible.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/submit-ticket">
              <Button size="lg" className="w-full sm:w-auto">
                Submit a Ticket
              </Button>
            </Link>
            <Link to="/my-tickets">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                View My Tickets
              </Button>
            </Link>
          </div>
          
          <div className="mt-12 flex justify-center">
            <Link to="/admin" className="text-sm text-muted-foreground hover:text-primary">
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
