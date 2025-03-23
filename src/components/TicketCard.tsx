
import React, { useState, useEffect, useRef } from "react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { useTickets } from "@/hooks/useTicketContext";
import { Ticket, TicketReply } from "@/types/ticket";
import { useToast } from "@/hooks/use-toast";
import TicketReplyDialog from "@/components/admin/TicketReplyDialog";
import TicketStatusBadge from "@/components/ticket/TicketStatusBadge";
import TicketActionButtons from "@/components/ticket/TicketActionButtons";
import TicketStatusButtons from "@/components/ticket/TicketStatusButtons";
import { fetchReplies } from "@/utils/tickets";
import { Button } from "@/components/ui/button";

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
  const [lastReply, setLastReply] = useState<TicketReply | null>(null);
  const [isLoadingReplies, setIsLoadingReplies] = useState(false);
  const { toast } = useToast();
  const repliesCache = useRef<Record<string, TicketReply[]>>({});
  
  useEffect(() => {
    if (isExpanded && !lastReply) {
      const loadLastReply = async () => {
        setIsLoadingReplies(true);
        try {
          if (repliesCache.current[ticket.id] && repliesCache.current[ticket.id].length > 0) {
            const cachedReplies = repliesCache.current[ticket.id];
            setLastReply(cachedReplies[cachedReplies.length - 1]);
            setIsLoadingReplies(false);
            return;
          }
          
          const fetchedReplies = await fetchReplies(ticket.id);
          if (fetchedReplies.length > 0) {
            setLastReply(fetchedReplies[fetchedReplies.length - 1]);
            repliesCache.current[ticket.id] = fetchedReplies;
          }
        } catch (error) {
          console.error("Failed to load last reply:", error);
        } finally {
          setIsLoadingReplies(false);
        }
      };
      
      loadLastReply();
    }
  }, [isExpanded, ticket.id, lastReply]);
  
  const handleStatusChange = async (newStatus: "open" | "inProgress" | "resolved" | "closed") => {
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
      
      let statusMessage;
      if (newStatus === "inProgress") {
        statusMessage = "Ticket accepted and is now in progress";
      } else if (newStatus === "resolved") {
        statusMessage = "Ticket marked as resolved";
      } else if (newStatus === "closed") {
        statusMessage = "Ticket closed";
      } else {
        statusMessage = `Ticket status changed to ${newStatus}`;
      }
      
      toast({
        title: `Ticket updated`,
        description: statusMessage,
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
  
  const handleResolve = async () => {
    try {
      await handleStatusChange("resolved");
      
      await addReply(ticket.id, "System", "This ticket has been marked as resolved. If you need further assistance, please submit a new ticket.");
      
      toast({
        title: "Ticket resolved",
        description: "The ticket has been marked as resolved and a notification was sent to the customer.",
      });
    } catch (error) {
      console.error("Error resolving ticket:", error);
    }
  };
  
  const handleReply = () => {
    setIsReplyOpen(true);
  };
  
  const handleCloseTicket = async () => {
    try {
      await handleStatusChange("closed");
      
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
  
  const handleDialogClose = (newReplies?: TicketReply[]) => {
    if (newReplies && newReplies.length > 0) {
      repliesCache.current[ticket.id] = newReplies;
      setLastReply(newReplies[newReplies.length - 1]);
    }
    setIsReplyOpen(false);
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
            
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground mt-1">From: {ticket.name} ({ticket.email})</p>
              
              {!isExpanded && lastReply && (
                <span className="text-xs bg-secondary/20 px-2 py-1 rounded-full">
                  {lastReply.is_from_guest ? "Last message from customer" : "Last replied by support"}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
            <TicketActionButtons 
              ticket={ticket}
              onAccept={handleAccept}
              onReply={handleReply}
              onClose={handleCloseTicket}
              onResolve={handleResolve}
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
            
            {lastReply && (
              <div className="mt-4 border-t pt-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-medium">Last Message</h4>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleReply}
                    className="text-xs h-8"
                    disabled={ticket.status === "resolved" || ticket.status === "closed"}
                  >
                    View Full Chat
                  </Button>
                </div>
                
                <div 
                  className={`p-3 rounded-lg text-sm ${
                    lastReply.is_from_guest 
                      ? "bg-blue-50 border border-blue-100" 
                      : lastReply.admin_name === "System"
                        ? "bg-secondary/30"
                        : "bg-primary/10"
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="font-medium">
                      {lastReply.is_from_guest 
                        ? "Guest" 
                        : lastReply.admin_name === "System"
                          ? "System"
                          : lastReply.admin_name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(lastReply.created_at), { addSuffix: true })}
                    </div>
                  </div>
                  <div className="whitespace-pre-wrap">{lastReply.message}</div>
                </div>
              </div>
            )}
            
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
        onClose={handleDialogClose} 
      />
    </>
  );
};

export default TicketCard;
