
import React, { createContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import { Ticket, TicketContextType } from "@/types/ticket";
import { 
  fetchTickets, 
  fetchTicketById, 
  createTicket, 
  updateTicketStatus,
  subscribeToTicketUpdates,
  createReply
} from "@/utils/tickets";
import { supabase } from "@/integrations/supabase/client";

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
        // Important: preserve the status values exactly as they come from the database
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
    
    // Set up real-time subscription for all ticket updates
    const channel = supabase
      .channel('public:tickets')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'tickets'
      }, async (payload) => {
        console.log('Received real-time update for tickets table:', payload);
        
        // Refresh the entire ticket list to ensure consistency
        const freshTickets = await fetchTickets();
        setTickets(freshTickets);
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
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
      console.log("TicketContext - Starting ticket update:", {
        id: updatedTicket.id,
        status: updatedTicket.status,
        statusType: typeof updatedTicket.status
      });
      
      // Make sure we're sending the exact status to the database
      await updateTicketStatus(updatedTicket);
      
      // Update local state to reflect the change immediately
      setTickets(prevTickets =>
        prevTickets.map(ticket => 
          ticket.id === updatedTicket.id ? updatedTicket : ticket
        )
      );
      
      console.log("TicketContext - Local state updated");
    } catch (error) {
      console.error("Error updating ticket:", error);
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
