
import React from "react";
import { Ticket } from "@/types/ticket";
import TicketCard from "@/components/TicketCard";
import TicketSkeleton from "./TicketSkeleton";
import { AlertCircle } from "lucide-react";

interface TicketsListProps {
  tickets: Ticket[];
  filterType: "all" | "open" | "inProgress" | "resolved" | "closed";
  isLoading?: boolean;
}

const TicketsList: React.FC<TicketsListProps> = ({ 
  tickets, 
  filterType,
  isLoading = false
}) => {
  const getFilterTitle = () => {
    switch (filterType) {
      case "all": return "All Tickets";
      case "open": return "Open Tickets";
      case "inProgress": return "In Progress Tickets";
      case "resolved": return "Resolved Tickets";
      case "closed": return "Closed Tickets";
    }
  };

  return (
    <div className="bg-card border rounded-lg shadow-sm overflow-hidden">
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold">{getFilterTitle()}</h2>
      </div>
      
      <div className="divide-y">
        {isLoading ? (
          // Show skeleton loading state when loading
          Array.from({ length: 3 }).map((_, index) => (
            <div key={`skeleton-${index}`} className="p-4">
              <TicketSkeleton />
            </div>
          ))
        ) : tickets.length > 0 ? (
          tickets.map((ticket: Ticket) => (
            <div key={ticket.id} className="p-4">
              <TicketCard ticket={ticket} />
            </div>
          ))
        ) : (
          <div className="p-8 text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <AlertCircle className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No tickets found</h3>
            <p className="text-muted-foreground">
              There are no tickets matching the current filter. Try changing the filter or toggle the "Show Resolved Tickets" option.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketsList;
