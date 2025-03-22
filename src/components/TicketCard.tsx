
import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { Ticket, useTickets } from "@/contexts/TicketContext";

interface TicketCardProps {
  ticket: Ticket;
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket }) => {
  const { updateTicket } = useTickets();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const statusColors = {
    open: "bg-blue-50 text-blue-700 border-blue-200",
    inProgress: "bg-yellow-50 text-yellow-700 border-yellow-200",
    resolved: "bg-green-50 text-green-700 border-green-200"
  };
  
  const handleStatusChange = (newStatus: "open" | "inProgress" | "resolved") => {
    updateTicket({ ...ticket, status: newStatus });
  };
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  
  return (
    <div 
      className={cn(
        "border rounded-lg bg-card shadow-sm overflow-hidden transition-all duration-300",
        isExpanded ? "transform scale-[1.01]" : ""
      )}
    >
      <div 
        onClick={toggleExpand}
        className="p-5 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between"
      >
        <div>
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
              {formatDistanceToNow(new Date(ticket.timestamp), { addSuffix: true })}
            </span>
          </div>
          <h3 className="font-medium text-lg">{ticket.subject}</h3>
          <p className="text-sm text-muted-foreground mt-1">From: {ticket.name} ({ticket.email})</p>
        </div>
        
        <div className={cn(
          "transform transition-transform duration-300", 
          isExpanded ? "rotate-180" : ""
        )}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </div>
      
      {isExpanded && (
        <div className="px-5 pb-5 animate-slide-down">
          <div className="text-sm border-t pt-4 pb-3 whitespace-pre-wrap">
            {ticket.message}
          </div>
          
          <div className="flex items-center space-x-2 pt-2">
            <button
              onClick={() => handleStatusChange("open")}
              className={cn(
                "px-3 py-1 text-xs rounded-full border transition-colors",
                ticket.status === "open" ? "bg-blue-100 text-blue-800 border-blue-200" : "bg-white text-muted-foreground border-input hover:bg-blue-50"
              )}
            >
              Open
            </button>
            <button
              onClick={() => handleStatusChange("inProgress")}
              className={cn(
                "px-3 py-1 text-xs rounded-full border transition-colors",
                ticket.status === "inProgress" ? "bg-yellow-100 text-yellow-800 border-yellow-200" : "bg-white text-muted-foreground border-input hover:bg-yellow-50"
              )}
            >
              In Progress
            </button>
            <button
              onClick={() => handleStatusChange("resolved")}
              className={cn(
                "px-3 py-1 text-xs rounded-full border transition-colors",
                ticket.status === "resolved" ? "bg-green-100 text-green-800 border-green-200" : "bg-white text-muted-foreground border-input hover:bg-green-50"
              )}
            >
              Resolved
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketCard;
