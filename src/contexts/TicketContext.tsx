
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Define the ticket interface
export interface Ticket {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "open" | "inProgress" | "resolved";
  timestamp: string;
}

// Define the context interface
interface TicketContextType {
  tickets: Ticket[];
  addTicket: (ticket: Ticket) => Promise<void>;
  updateTicket: (updatedTicket: Ticket) => void;
  getTicketById: (id: string) => Ticket | undefined;
}

// Create the context
const TicketContext = createContext<TicketContextType | undefined>(undefined);

// Provider component
export const TicketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  // Load tickets from localStorage on initial render
  useEffect(() => {
    const storedTickets = localStorage.getItem("tickets");
    if (storedTickets) {
      try {
        setTickets(JSON.parse(storedTickets));
      } catch (error) {
        console.error("Error parsing stored tickets:", error);
        localStorage.removeItem("tickets");
      }
    }
  }, []);

  // Save tickets to localStorage whenever tickets change
  useEffect(() => {
    localStorage.setItem("tickets", JSON.stringify(tickets));
  }, [tickets]);

  const addTicket = async (ticket: Ticket): Promise<void> => {
    setTickets(prevTickets => [...prevTickets, ticket]);
  };

  const updateTicket = (updatedTicket: Ticket): void => {
    setTickets(prevTickets =>
      prevTickets.map(ticket => 
        ticket.id === updatedTicket.id ? updatedTicket : ticket
      )
    );
  };

  const getTicketById = (id: string): Ticket | undefined => {
    return tickets.find(ticket => ticket.id === id);
  };

  return (
    <TicketContext.Provider value={{ tickets, addTicket, updateTicket, getTicketById }}>
      {children}
    </TicketContext.Provider>
  );
};

// Custom hook for using the ticket context
export const useTickets = (): TicketContextType => {
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error("useTickets must be used within a TicketProvider");
  }
  return context;
};
