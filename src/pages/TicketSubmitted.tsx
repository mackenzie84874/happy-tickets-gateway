
import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useTicketData } from "@/hooks/useTicketData";
import LoadingState from "@/components/ticket/LoadingState";
import ErrorState from "@/components/ticket/ErrorState";
import SuccessHeader from "@/components/ticket/SuccessHeader";
import TicketDetails from "@/components/ticket/TicketDetails";
import StarRating from "@/components/ticket/StarRating";
import { Card } from "@/components/ui/card";

const TicketSubmitted: React.FC = () => {
  const [searchParams] = useSearchParams();
  const ticketId = searchParams.get("id");
  const { ticket, loading, error, isUpdating, replies, repliesLoading } = useTicketData({ ticketId });

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return <LoadingState />;
  }

  if (error || !ticket) {
    return <ErrorState error={error} />;
  }

  // Show a prominent rating card if the ticket is closed
  const showRatingPrompt = ticket.status === "closed" && (!ticket.rating || ticket.rating === 0);

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center">
      <div className="container px-4 sm:px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <SuccessHeader />
          
          {/* Show rating prompt prominently when ticket is closed and not yet rated */}
          {showRatingPrompt && (
            <Card className="mb-8 p-6 border-2 border-primary/30 shadow-md bg-primary/5 animate-pulse">
              <div className="text-center mb-4">
                <h2 className="text-xl font-bold text-primary">Your Feedback Matters!</h2>
                <p className="text-gray-600 mt-2">
                  Your ticket has been closed. Please take a moment to rate our service.
                </p>
              </div>
              <StarRating 
                ticketId={ticket.id} 
                initialRating={ticket.rating || 0}
                onRatingSubmit={() => {
                  // Force reload the ticket data after rating
                  window.location.reload();
                }}
              />
            </Card>
          )}
          
          <TicketDetails 
            ticket={ticket} 
            isUpdating={isUpdating} 
            replies={replies}
            repliesLoading={repliesLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default TicketSubmitted;
