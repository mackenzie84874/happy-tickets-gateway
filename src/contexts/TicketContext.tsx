import React, { createContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Ticket, TicketContextType } from "@/types/ticket";
import { 
  fetchTickets, 
  fetchTicketById, 
  createTicket, 
  updateTicketStatus,
  subscribeToTicketUpdates,
  createReply
} from "@/utils/ticketUtils";

// Create the context
export const TicketContext = createContext<TicketContextType | undefined>(undefined);

// Provider component
export const TicketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const { toast } = useToast();

  // Fetch tickets from Supabase on initial render
  useEffect(() => {
    const loadTickets = async () => {
      try {
        const data = await fetchTickets();
        setTickets(data);
      } catch (error) {
        console.error("Error fetching tickets:", error);
        toast({
          title: "Error fetching tickets",
          description: "There was a problem loading your tickets.",
          variant: "destructive"
        });
      }
    };

    loadTickets();
  }, [toast]);

  const addTicket = async (ticketData: Omit<Ticket, "id" | "created_at">): Promise<string | undefined> => {
    try {
      const newTicket = await createTicket(ticketData);
      
      if (newTicket) {
        setTickets(prevTickets => [newTicket, ...prevTickets]);
        return newTicket.id;
      }
    } catch (error) {
      console.error("Error adding ticket:", error);
      toast({
        title: "Error submitting ticket",
        description: "There was a problem submitting your ticket. Please try again.",
        variant: "destructive"
      });
    }
    return undefined;
  };

  const updateTicket = async (updatedTicket: Ticket): Promise<void> => {
    try {
      await updateTicketStatus(updatedTicket);
      
      setTickets(prevTickets =>
        prevTickets.map(ticket => 
          ticket.id === updatedTicket.id ? updatedTicket : ticket
        )
      );
    } catch (error) {
      console.error("Error updating ticket:", error);
      toast({
        title: "Error updating ticket",
        description: "There was a problem updating the ticket.",
        variant: "destructive"
      });
    }
  };

  const getTicketById = async (id: string): Promise<Ticket | undefined> => {
    try {
      return await fetchTicketById(id);
    } catch (error) {
      console.error("Error fetching ticket:", error);
      toast({
        title: "Error fetching ticket",
        description: "There was a problem loading the ticket details.",
        variant: "destructive"
      });
    }
    return undefined;
  };

  // Function to subscribe to real-time updates for a specific ticket
  const subscribeToTicket = (id: string, callback: (ticket: Ticket) => void) => {
    // Subscribe to realtime updates
    const unsubscribe = subscribeToTicketUpdates(id, (updatedTicket) => {
      // Update the local state
      setTickets(prevTickets =>
        prevTickets.map(ticket => 
          ticket.id === id ? updatedTicket : ticket
        )
      );
      
      // Call the callback with the updated ticket
      callback(updatedTicket);
    });
    
    return unsubscribe;
  };

  // Function to add a reply to a ticket
  const addReply = async (ticketId: string, adminName: string, message: string): Promise<void> => {
    try {
      await createReply(ticketId, adminName, message);
      
      // No need to update local state as we'll get the update via the real-time subscription
    } catch (error) {
      console.error("Error adding reply:", error);
      toast({
        title: "Error sending reply",
        description: "There was a problem sending your reply. Please try again.",
        variant: "destructive"
      });
      throw error;
    }
  };

  return (
    <TicketContext.Provider value={{ 
      tickets, 
      addTicket, 
      updateTicket, 
      getTicketById, 
      subscribeToTicket,
      addReply
    }}>
      {children}
    </TicketContext.Provider>
  );
};

// Exporting from useTicketContext.ts now
export { useTickets } from "@/hooks/useTicketContext";
