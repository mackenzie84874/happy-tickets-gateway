
import React from "react";
import { cn } from "@/lib/utils";
import { Ticket } from "@/types/ticket";

interface TicketStatusButtonsProps {
  ticket: Ticket;
  onStatusChange: (newStatus: "open" | "inProgress" | "resolved" | "closed") => void;
  isUpdating?: boolean;
}

const TicketStatusButtons: React.FC<TicketStatusButtonsProps> = ({ 
  ticket, 
  onStatusChange, 
  isUpdating = false
}) => {
  const handleStatusClick = (status: "open" | "inProgress" | "resolved" | "closed") => {
    if (isUpdating || ticket.status === status) return;
    
    // Log the status change attempt for debugging
    console.log(`TicketStatusButtons - Changing status from ${ticket.status} to ${status}`);
    onStatusChange(status);
  };

  return (
    <div className="flex items-center space-x-2 pt-2">
      {/* Only show status change buttons if ticket is not closed */}
      {ticket.status !== "closed" && (
        <>
          <button
            onClick={() => handleStatusClick("open")}
            className={cn(
              "px-3 py-1 text-xs rounded-full border transition-colors",
              ticket.status === "open" ? "bg-blue-100 text-blue-800 border-blue-200" : "bg-white text-muted-foreground border-input hover:bg-blue-50",
              isUpdating && "opacity-50 cursor-not-allowed"
            )}
            disabled={isUpdating}
            data-status="open"
          >
            Open
          </button>
          <button
            onClick={() => handleStatusClick("inProgress")}
            className={cn(
              "px-3 py-1 text-xs rounded-full border transition-colors",
              ticket.status === "inProgress" ? "bg-yellow-100 text-yellow-800 border-yellow-200" : "bg-white text-muted-foreground border-input hover:bg-yellow-50",
              isUpdating && "opacity-50 cursor-not-allowed"
            )}
            disabled={isUpdating}
            data-status="inProgress"
          >
            In Progress
          </button>
          <button
            onClick={() => handleStatusClick("resolved")}
            className={cn(
              "px-3 py-1 text-xs rounded-full border transition-colors",
              ticket.status === "resolved" ? "bg-green-100 text-green-800 border-green-200" : "bg-white text-muted-foreground border-input hover:bg-green-50",
              isUpdating && "opacity-50 cursor-not-allowed"
            )}
            disabled={isUpdating}
            data-status="resolved"
          >
            Resolved
          </button>
        </>
      )}
      <button
        onClick={() => handleStatusClick("closed")}
        className={cn(
          "px-3 py-1 text-xs rounded-full border transition-colors",
          ticket.status === "closed" ? "bg-gray-100 text-gray-800 border-gray-200" : "bg-white text-muted-foreground border-input hover:bg-gray-50",
          (isUpdating || ticket.status === "closed") && "opacity-50 cursor-not-allowed"
        )}
        disabled={isUpdating || ticket.status === "closed"}
        data-status="closed"
      >
        Close
      </button>
    </div>
  );
};

export default TicketStatusButtons;
