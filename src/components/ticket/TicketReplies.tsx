
import React from "react";
import { TicketReply } from "@/types/ticket";
import { Loader2 } from "lucide-react";
import StarRating from "./StarRating";
import { useToast } from "@/hooks/use-toast";
import LiveTicketChat from "./LiveTicketChat";

interface TicketRepliesProps {
  replies: TicketReply[];
  isLoading: boolean;
  ticketId?: string;
  ticketStatus?: string;
  ticketRating?: number;
  showInlineRating?: boolean;
}

const TicketReplies: React.FC<TicketRepliesProps> = ({ 
  replies, 
  isLoading,
  ticketId,
  ticketStatus,
  ticketRating = 0,
  showInlineRating = false
}) => {
  const { toast } = useToast();
  
  // Handle the rating UI separately from the chat
  const renderRatingUI = () => {
    const thankYouMessage = replies.find(reply => 
      reply.admin_name === "System" && 
      reply.message.includes("Thank you for using our support") && 
      reply.message.includes("Please rate us")
    );
    
    if (thankYouMessage && showInlineRating && ticketId) {
      return (
        <div className="mt-4 p-4 border rounded-lg bg-background">
          <h4 className="text-sm font-medium text-center mb-2">Rate our support</h4>
          <StarRating 
            ticketId={ticketId}
            initialRating={ticketRating}
            onRatingSubmit={() => {
              toast({
                title: "Rating submitted",
                description: "Thank you for your feedback!",
              });
              // Force reload the page to refresh the data
              window.location.reload();
            }}
          />
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Conversation</h3>
      
      <LiveTicketChat 
        replies={replies} 
        isLoading={isLoading}
        isGuestView={true} // This is in the guest view context
      />
      
      {renderRatingUI()}
    </div>
  );
};

export default TicketReplies;
