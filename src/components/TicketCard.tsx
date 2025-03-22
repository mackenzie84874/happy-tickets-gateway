import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { useTickets } from "@/hooks/useTicketContext";
import { Ticket } from "@/types/ticket";
import { Button } from "@/components/ui/button";
import { MessageCircle, CheckCircle, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import TicketReplyDialog from "@/components/admin/TicketReplyDialog";

interface TicketCardProps {
  ticket: Ticket;
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket }) => {
  const { updateTicket, addReply } = useTickets();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const { toast } = useToast();
  
  const statusColors = {
    open: "bg-blue-50 text-blue-700 border-blue-200",
    inProgress: "bg-yellow-50 text-yellow-700 border-yellow-200",
    resolved: "bg-green-50 text-green-700 border-green-200",
    closed: "bg-gray-50 text-gray-700 border-gray-200"
  };
  
  const handleStatusChange = async (newStatus: "open" | "inProgress" | "resolved" | "closed") => {
    // If ticket is already closed, don't allow status changes
    if (ticket.status === "closed") {
      toast({
        title: "Cannot update closed ticket",
        description: "Closed tickets cannot be reopened or modified.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await updateTicket({ ...ticket, status: newStatus });
      
      // Show success toast
      toast({
        title: `Ticket ${newStatus === "inProgress" ? "accepted" : "updated"}`,
        description: `Ticket status changed to ${newStatus === "inProgress" ? "In Progress" : newStatus}`,
      });
    } catch (error) {
      console.error("Error updating ticket status:", error);
      toast({
        title: "Error updating ticket",
        description: "Failed to update ticket status. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleAccept = () => {
    handleStatusChange("inProgress");
  };
  
  const handleReply = () => {
    setIsReplyOpen(true);
  };
  
  const handleCloseTicket = async () => {
    try {
      // First change the status to closed
      await handleStatusChange("closed");
      
      // Then send an automated thank you message
      await addReply(ticket.id, "System", "Thank you for using our support! Please rate us 1-5 stars.");
      
      toast({
        title: "Ticket closed",
        description: "The ticket has been closed and a thank you message was sent to the customer.",
      });
    } catch (error) {
      console.error("Error closing ticket:", error);
      toast({
        title: "Error closing ticket",
        description: "Failed to close the ticket. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <>
      <div 
        className={cn(
          "border rounded-lg bg-card shadow-sm overflow-hidden transition-all duration-300",
          isExpanded ? "transform scale-[1.01]" : ""
        )}
      >
        <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between">
          <div 
            onClick={toggleExpand}
            className="cursor-pointer flex-grow"
          >
            <div className="flex items-center space-x-3 mb-2">
              <span 
                className={cn(
                  "px-2.5 py-0.5 rounded-full text-xs font-medium border",
                  statusColors[ticket.status as keyof typeof statusColors]
                )}
              >
                {ticket.status === "inProgress" ? "In Progress" : ticket.status}
              </span>
              <span className="text-xs text-muted-foreground">
                {ticket.created_at && formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true })}
              </span>
            </div>
            <h3 className="font-medium text-lg">{ticket.subject}</h3>
            <p className="text-sm text-muted-foreground mt-1">From: {ticket.name} ({ticket.email})</p>
          </div>
          
          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
            {ticket.status !== "resolved" && ticket.status !== "closed" && (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleAccept}
                  disabled={ticket.status === "inProgress"}
                  className={ticket.status === "inProgress" ? "bg-yellow-50" : ""}
                >
                  <CheckCircle className="mr-1 h-4 w-4" />
                  {ticket.status === "inProgress" ? "Accepted" : "Accept"}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleReply}
                >
                  <MessageCircle className="mr-1 h-4 w-4" />
                  Reply
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleCloseTicket}
                  className="border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  <Lock className="mr-1 h-4 w-4" />
                  Close
                </Button>
              </>
            )}
            <div 
              className={cn(
                "cursor-pointer transform transition-transform duration-300 ml-2", 
                isExpanded ? "rotate-180" : ""
              )}
              onClick={toggleExpand}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </div>
        </div>
        
        {isExpanded && (
          <div className="px-5 pb-5 animate-slide-down">
            <div className="text-sm border-t pt-4 pb-3 whitespace-pre-wrap">
              {ticket.message}
            </div>
            
            <div className="flex items-center space-x-2 pt-2">
              {/* Don't show status change buttons if ticket is closed */}
              {ticket.status !== "closed" && (
                <>
                  <button
                    onClick={() => handleStatusChange("open")}
                    className={cn(
                      "px-3 py-1 text-xs rounded-full border transition-colors",
                      ticket.status === "open" ? "bg-blue-100 text-blue-800 border-blue-200" : "bg-white text-muted-foreground border-input hover:bg-blue-50"
                    )}
                    disabled={ticket.status === "closed"}
                  >
                    Open
                  </button>
                  <button
                    onClick={() => handleStatusChange("inProgress")}
                    className={cn(
                      "px-3 py-1 text-xs rounded-full border transition-colors",
                      ticket.status === "inProgress" ? "bg-yellow-100 text-yellow-800 border-yellow-200" : "bg-white text-muted-foreground border-input hover:bg-yellow-50"
                    )}
                    disabled={ticket.status === "closed"}
                  >
                    In Progress
                  </button>
                  <button
                    onClick={() => handleStatusChange("resolved")}
                    className={cn(
                      "px-3 py-1 text-xs rounded-full border transition-colors",
                      ticket.status === "resolved" ? "bg-green-100 text-green-800 border-green-200" : "bg-white text-muted-foreground border-input hover:bg-green-50"
                    )}
                    disabled={ticket.status === "closed"}
                  >
                    Resolved
                  </button>
                </>
              )}
              <button
                onClick={() => handleStatusChange("closed")}
                className={cn(
                  "px-3 py-1 text-xs rounded-full border transition-colors",
                  ticket.status === "closed" ? "bg-gray-100 text-gray-800 border-gray-200" : "bg-white text-muted-foreground border-input hover:bg-gray-50"
                )}
                disabled={ticket.status === "closed"}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
      
      <TicketReplyDialog 
        ticket={ticket} 
        isOpen={isReplyOpen} 
        onClose={() => setIsReplyOpen(false)} 
      />
    </>
  );
};

export default TicketCard;
