
import React from "react";
import { cn } from "@/lib/utils";
import { Ticket } from "@/types/ticket";
import StarRating from "./StarRating";

interface TicketStatusButtonsProps {
  ticket: Ticket;
  onStatusChange: (newStatus: "open" | "inProgress" | "resolved" | "closed") => void;
}

const TicketStatusButtons: React.FC<TicketStatusButtonsProps> = ({ 
  ticket, 
  onStatusChange 
}) => {
  return (
    <div className="flex flex-col space-y-4 pt-2">
      {/* Show star rating when ticket is resolved */}
      {ticket.status === "resolved" && !ticket.rating && (
        <div className="mb-2">
          <StarRating 
            ticketId={ticket.id} 
            initialRating={ticket.rating || 0}
          />
        </div>
      )}
      
      <div className="flex items-center space-x-2">
        {/* Only show status change buttons if ticket is not closed */}
        {ticket.status !== "closed" && (
          <>
            <button
              onClick={() => onStatusChange("open")}
              className={cn(
                "px-3 py-1 text-xs rounded-full border transition-colors",
                ticket.status === "open" ? "bg-blue-100 text-blue-800 border-blue-200" : "bg-white text-muted-foreground border-input hover:bg-blue-50"
              )}
              data-status={ticket.status}
              data-button-for="open"
            >
              Open
            </button>
            <button
              onClick={() => onStatusChange("inProgress")}
              className={cn(
                "px-3 py-1 text-xs rounded-full border transition-colors",
                ticket.status === "inProgress" ? "bg-yellow-100 text-yellow-800 border-yellow-200" : "bg-white text-muted-foreground border-input hover:bg-yellow-50"
              )}
              data-status={ticket.status}
              data-button-for="inProgress"
            >
              In Progress
            </button>
            <button
              onClick={() => onStatusChange("resolved")}
              className={cn(
                "px-3 py-1 text-xs rounded-full border transition-colors",
                ticket.status === "resolved" ? "bg-green-100 text-green-800 border-green-200" : "bg-white text-muted-foreground border-input hover:bg-green-50"
              )}
              data-status={ticket.status}
              data-button-for="resolved"
            >
              Resolved
            </button>
          </>
        )}
        <button
          onClick={() => onStatusChange("closed")}
          className={cn(
            "px-3 py-1 text-xs rounded-full border transition-colors",
            ticket.status === "closed" ? "bg-gray-100 text-gray-800 border-gray-200" : "bg-white text-muted-foreground border-input hover:bg-gray-50"
          )}
          disabled={ticket.status === "closed"}
          data-status={ticket.status}
          data-button-for="closed"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default TicketStatusButtons;
