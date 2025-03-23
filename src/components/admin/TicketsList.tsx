
import React from "react";
import { Ticket } from "@/types/ticket";
import TicketCard from "@/components/TicketCard";

interface TicketsListProps {
  tickets: Ticket[];
  filterType: "all" | "open" | "inProgress" | "resolved" | "closed";
}

const TicketsList: React.FC<TicketsListProps> = ({ tickets, filterType }) => {
  const getFilterTitle = () => {
    switch (filterType) {
      case "all": return "All Tickets";
      case "open": return "Open Tickets";
      case "inProgress": return "In Progress Tickets";
      case "resolved": return "Resolved Tickets";
      case "closed": return "Closed Tickets";
    }
  };

  // Filter tickets based on selected status if needed
  const displayTickets = filterType === "all" 
    ? tickets 
    : tickets.filter(ticket => ticket.status === filterType);

  return (
    <div className="bg-card border rounded-lg shadow-sm overflow-hidden">
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold">{getFilterTitle()}</h2>
      </div>
      
      <div className="divide-y">
        {displayTickets.length > 0 ? (
          displayTickets.map((ticket: Ticket) => (
            <div key={ticket.id} className="p-4">
              <TicketCard ticket={ticket} />
            </div>
          ))
        ) : (
          <div className="p-8 text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                <rect x="2" y="6" width="20" height="8" rx="1"></rect>
                <path d="M6 14v3a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-3"></path>
                <path d="M4 10h16"></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">No tickets found</h3>
            <p className="text-muted-foreground">
              There are no tickets matching the current filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketsList;
