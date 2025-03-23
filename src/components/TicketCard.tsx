
import React, { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { useTickets } from "@/hooks/useTicketContext";
import { Ticket, TicketReply } from "@/types/ticket";
import { useToast } from "@/hooks/use-toast";
import TicketReplyDialog from "@/components/admin/TicketReplyDialog";
import TicketStatusBadge from "@/components/ticket/TicketStatusBadge";
import TicketActionButtons from "@/components/ticket/TicketActionButtons";
import TicketStatusButtons from "@/components/ticket/TicketStatusButtons";
import { fetchReplies } from "@/utils/tickets/ticketReplies";

interface TicketCardProps {
  ticket: Ticket;
  isSelected?: boolean;
  onToggleSelect?: (ticketId: string) => void;
}

const TicketCard: React.FC<TicketCardProps> = ({ 
  ticket, 
  isSelected = false,
  onToggleSelect
}) => {
  const { updateTicket, addReply } = useTickets();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [replies, setReplies] = useState<TicketReply[]>([]);
  const [isLoadingReplies, setIsLoadingReplies] = useState(false);
  const { toast } = useToast();
  
  // Fetch replies when card is expanded
  useEffect(() => {
    if (isExpanded && replies.length === 0) {
      const loadReplies = async () => {
        setIsLoadingReplies(true);
        try {
          const fetchedReplies = await fetchReplies(ticket.id);
          setReplies(fetchedReplies);
        } catch (error) {
          console.error("Failed to load replies:", error);
        } finally {
          setIsLoadingReplies(false);
        }
      };
      
      loadReplies();
    }
  }, [isExpanded, ticket.id, replies.length]);
  
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
          isExpanded ? "transform scale-[1.01]" : "",
          isSelected ? "ring-2 ring-primary" : ""
        )}
      >
        <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between">
          {onToggleSelect && (
            <div className="mr-3 flex items-center">
              <input 
                type="checkbox" 
                checked={isSelected}
                onChange={() => onToggleSelect(ticket.id)}
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
            </div>
          )}

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
            
            {/* Display ticket replies */}
            {replies.length > 0 && (
              <div className="mt-4 border-t pt-4">
                <h4 className="text-sm font-medium mb-3">Conversation History</h4>
                <div className="space-y-3">
                  {replies.map((reply) => (
                    <div 
                      key={reply.id}
                      className={`p-3 rounded-lg text-sm ${
                        reply.is_from_guest 
                          ? "bg-blue-50 border border-blue-100" 
                          : reply.admin_name === "System"
                            ? "bg-gray-50 border border-gray-100"
                            : "bg-green-50 border border-green-100"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <div className="font-medium">
                          {reply.is_from_guest 
                            ? "Guest" 
                            : reply.admin_name === "System"
                              ? "System"
                              : reply.admin_name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(reply.created_at).toLocaleString()}
                        </div>
                      </div>
                      <div className="whitespace-pre-wrap">{reply.message}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Loading state for replies */}
            {isLoadingReplies && (
              <div className="flex justify-center py-3">
                <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>
              </div>
            )}
            
            <TicketStatusButtons 
              ticket={ticket}
              onStatusChange={handleStatusChange}
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
