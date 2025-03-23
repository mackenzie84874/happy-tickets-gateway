
import React from "react";
import { format } from "date-fns";
import { TicketReply } from "@/types/ticket";
import { Loader2 } from "lucide-react";
import StarRating from "./StarRating";
import { useToast } from "@/hooks/use-toast";

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
  
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        <p className="mt-2 text-sm text-muted-foreground">Loading replies...</p>
      </div>
    );
  }

  if (replies.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No replies yet. We'll contact you soon.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Conversation History</h3>
      <div className="space-y-4">
        {replies.map((reply, index) => {
          const isSystemMessage = reply.admin_name === "System";
          const isThankYouMessage = isSystemMessage && 
            reply.message.includes("Thank you for using our support") && 
            reply.message.includes("Please rate us");
          
          return (
            <div 
              key={reply.id} 
              className={`p-4 rounded-lg ${
                isSystemMessage ? "bg-secondary/20" : "bg-primary/10"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="font-medium">
                  {isSystemMessage ? "Support System" : reply.admin_name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {format(new Date(reply.created_at), "PPp")}
                </div>
              </div>
              
              <div className="whitespace-pre-wrap">{reply.message}</div>
              
              {/* Add rating box below the thank you message */}
              {isThankYouMessage && showInlineRating && ticketId && (
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
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TicketReplies;
