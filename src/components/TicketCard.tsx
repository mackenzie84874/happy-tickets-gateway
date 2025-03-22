
import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { useTickets } from "@/hooks/useTicketContext";
import { Ticket } from "@/types/ticket";
import { useToast } from "@/hooks/use-toast";
import TicketReplyDialog from "@/components/admin/TicketReplyDialog";
import TicketStatusBadge from "@/components/ticket/TicketStatusBadge";
import TicketActionButtons from "@/components/ticket/TicketActionButtons";
import TicketStatusButtons from "@/components/ticket/TicketStatusButtons";

interface TicketCardProps {
  ticket: Ticket;
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket }) => {
  const { updateTicket, addReply } = useTickets();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();
  
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
    
    // If already updating or status is the same, don't proceed
    if (isUpdating || ticket.status === newStatus) {
      return;
    }
    
    setIsUpdating(true);
    
    try {
      console.log(`TicketCard - Changing ticket ${ticket.id} status from ${ticket.status} to ${newStatus}`);
      
      // Create a complete updatedTicket object
      const updatedTicket = {
        ...ticket,
        status: newStatus
      };
      
      // Send the status update to the server
      await updateTicket(updatedTicket);
      
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
    } finally {
      setIsUpdating(false);
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
          isExpanded ? "transform scale-[1.01]" : "",
          isUpdating ? "opacity-70" : ""
        )}
      >
        <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between">
          <div 
            onClick={toggleExpand}
            className="cursor-pointer flex-grow"
          >
            <div className="flex items-center space-x-3 mb-2">
              <TicketStatusBadge status={ticket.status} />
              <span className="text-xs text-muted-foreground">
                {ticket.created_at && formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true })}
              </span>
            </div>
            <h3 className="font-medium text-lg">{ticket.subject}</h3>
            <p className="text-sm text-muted-foreground mt-1">From: {ticket.name} ({ticket.email})</p>
          </div>
          
          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
            <TicketActionButtons 
              ticket={ticket}
              onAccept={handleAccept}
              onReply={handleReply}
              onClose={handleCloseTicket}
            />
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
            
            <TicketStatusButtons 
              ticket={ticket}
              onStatusChange={handleStatusChange}
              isUpdating={isUpdating}
            />
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
