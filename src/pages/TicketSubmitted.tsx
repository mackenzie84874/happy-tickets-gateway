import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useTicketData } from "@/hooks/useTicketData";
import LoadingState from "@/components/ticket/LoadingState";
import ErrorState from "@/components/ticket/ErrorState";
import SuccessHeader from "@/components/ticket/SuccessHeader";
import TicketDetails from "@/components/ticket/TicketDetails";
import StarRating from "@/components/ticket/StarRating";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const TicketSubmitted: React.FC = () => {
  const [searchParams] = useSearchParams();
  const ticketId = searchParams.get("id");
  const { ticket, loading, error, isUpdating, replies, repliesLoading } = useTicketData({ ticketId });
  const { toast } = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (ticket) {
      console.log("Ticket data in TicketSubmitted:", {
        id: ticket.id,
        status: ticket.status,
        rating: ticket.rating || 0
      });
    }
  }, [ticket]);

  if (loading) {
    return <LoadingState />;
  }

  if (error || !ticket) {
    return <ErrorState error={error} />;
  }

  const showRatingPrompt = ticket.status === "closed" && (!ticket.rating || ticket.rating === 0);
  
  console.log("Should show rating prompt:", showRatingPrompt);

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center">
      <div className="container px-4 sm:px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <SuccessHeader />
          
          {showRatingPrompt && (
            <Card className="mb-8 p-6 border-2 border-primary/30 shadow-md bg-primary/5">
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
                  toast({
                    title: "Rating submitted",
                    description: "Thank you for your feedback!",
                  });
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
            showInlineRating={ticket.status === "closed" && (!ticket.rating || ticket.rating === 0)}
          />
          
          <div className="mt-6 flex justify-center">
            <Link to="/my-tickets">
              <Button variant="outline" className="text-sm">
                View All My Tickets
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketSubmitted;
