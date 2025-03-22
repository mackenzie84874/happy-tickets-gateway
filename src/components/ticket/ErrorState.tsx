
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface ErrorStateProps {
  error: string | null;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error }) => {
  return (
    <div className="min-h-screen pt-20 flex items-center justify-center">
      <div className="container px-4 sm:px-6 py-12">
        <Alert variant="destructive" className="max-w-md mx-auto">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error || "Unable to load ticket details"}. Please try submitting your ticket again.
          </AlertDescription>
        </Alert>
        <div className="max-w-md mx-auto mt-6 text-center">
          <Link to="/submit-ticket">
            <Button>Return to Submit Ticket</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ErrorState;
