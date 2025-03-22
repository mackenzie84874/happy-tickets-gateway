
import React, { createContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import { Ticket, TicketContextType } from "@/types/ticket";
import { 
  fetchTickets, 
  fetchTicketById, 
  createTicket, 
  updateTicketStatus,
  subscribeToTicketUpdates,
  subscribeToTicketList,
  createReply
} from "@/utils/tickets";

// Create the context
export const TicketContext = createContext<TicketContextType | undefined>(undefined);

// Provider component
export const TicketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch tickets from Supabase on initial render
  useEffect(() => {
    const loadTickets = async () => {
      setIsLoading(true);
      try {
        console.log("TicketContext - Fetching all tickets");
        const data = await fetchTickets();
        console.log("TicketContext - Tickets fetched:", data.length);
        // Important: preserve the status values exactly as they come from the database
        setTickets(data);
      } catch (error) {
        console.error("Error fetching tickets:", error);
        toast({
          title: "Error fetching tickets",
          description: "There was a problem loading your tickets.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadTickets();
    
    // Set up real-time subscription for ticket updates
    const unsubscribeFromTicketsList = subscribeToTicketList((updatedTicket) => {
      console.log("TicketContext - Real-time update received for ticket:", updatedTicket.id);
      
      setTickets(prevTickets => 
        prevTickets.map(ticket => 
          ticket.id === updatedTicket.id ? updatedTicket : ticket
        )
      );
      
      // Show toast for ticket updates
      toast({
        title: "Ticket Updated",
        description: `Ticket #${updatedTicket.id.slice(0, 8)} status changed to ${updatedTicket.status}`,
      });
    });
    
    return () => {
      unsubscribeFromTicketsList();
    };
  }, [toast]);

  const addTicket = async (ticketData: Omit<Ticket, "id" | "created_at">): Promise<string | undefined> => {
    try {
      console.log("TicketContext - Creating new ticket");
      const newTicket = await createTicket(ticketData);
      
      if (newTicket) {
        console.log("TicketContext - Ticket created:", newTicket.id);
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
      console.log("TicketContext - Starting ticket update:", {
        id: updatedTicket.id,
        status: updatedTicket.status,
        statusType: typeof updatedTicket.status
      });
      
      // First update local state for immediate UI response
      setTickets(prevTickets =>
        prevTickets.map(ticket => 
          ticket.id === updatedTicket.id ? {...ticket, status: updatedTicket.status} : ticket
        )
      );
      
      // Then make sure we're sending the exact status to the database
      const serverUpdatedTicket = await updateTicketStatus(updatedTicket);
      
      console.log("TicketContext - Server returned updated ticket:", serverUpdatedTicket);
      
      // If the server returns different data than what we expected, update our local state again
      if (serverUpdatedTicket && serverUpdatedTicket.status !== updatedTicket.status) {
        console.log("TicketContext - Syncing local state with server data");
        setTickets(prevTickets =>
          prevTickets.map(ticket => 
            ticket.id === serverUpdatedTicket.id ? serverUpdatedTicket : ticket
          )
        );
      }
      
      toast({
        title: "Ticket updated",
        description: `Ticket status changed to ${serverUpdatedTicket.status}`,
      });
      
      console.log("TicketContext - Ticket update completed");
    } catch (error) {
      console.error("Error updating ticket:", error);
      
      // Revert the local state change if there was an error
      const originalTicket = await fetchTicketById(updatedTicket.id);
      if (originalTicket) {
        setTickets(prevTickets =>
          prevTickets.map(ticket => 
            ticket.id === updatedTicket.id ? originalTicket : ticket
          )
        );
      }
      
      toast({
        title: "Error updating ticket",
        description: "There was a problem updating the ticket.",
        variant: "destructive"
      });
      throw error; // Re-throw to allow component to handle the error
    }
  };

  const getTicketById = async (id: string): Promise<Ticket | undefined> => {
    try {
      console.log("TicketContext - Fetching ticket by ID:", id);
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
    console.log("TicketContext - Setting up subscription for ticket:", id);
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
      console.log("TicketContext - Adding reply to ticket:", ticketId);
      await createReply(ticketId, adminName, message);
      // No need to update local state as we'll get the update via the real-time subscription
      toast({
        title: "Reply sent",
        description: "Your message has been sent successfully.",
      });
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
      isLoading,
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
