
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

// Define the ticket interface
export interface Ticket {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "open" | "inProgress" | "resolved";
  created_at?: string;
}

// Define the context interface
interface TicketContextType {
  tickets: Ticket[];
  addTicket: (ticket: Omit<Ticket, "id" | "created_at">) => Promise<string | undefined>;
  updateTicket: (updatedTicket: Ticket) => void;
  getTicketById: (id: string) => Promise<Ticket | undefined>;
  subscribeToTicket: (id: string, callback: (ticket: Ticket) => void) => () => void;
}

// Create the context
const TicketContext = createContext<TicketContextType | undefined>(undefined);

// Provider component
export const TicketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const { toast } = useToast();

  // Fetch tickets from Supabase on initial render
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const { data, error } = await supabase
          .from('tickets')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        if (data) {
          // Convert status to the correct type
          const formattedTickets = data.map(ticket => ({
            ...ticket,
            status: ticket.status as "open" | "inProgress" | "resolved"
          }));
          setTickets(formattedTickets);
        }
      } catch (error) {
        console.error("Error fetching tickets:", error);
        toast({
          title: "Error fetching tickets",
          description: "There was a problem loading your tickets.",
          variant: "destructive"
        });
      }
    };

    fetchTickets();
  }, [toast]);

  const addTicket = async (ticketData: Omit<Ticket, "id" | "created_at">): Promise<string | undefined> => {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .insert([ticketData])
        .select()
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        const newTicket = {
          ...data,
          status: data.status as "open" | "inProgress" | "resolved"
        };
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
      const { error } = await supabase
        .from('tickets')
        .update({
          name: updatedTicket.name,
          email: updatedTicket.email,
          subject: updatedTicket.subject,
          message: updatedTicket.message,
          status: updatedTicket.status
        })
        .eq('id', updatedTicket.id);

      if (error) {
        throw error;
      }

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
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        return {
          ...data,
          status: data.status as "open" | "inProgress" | "resolved"
        };
      }
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

  // Add a function to subscribe to real-time updates for a specific ticket
  const subscribeToTicket = (id: string, callback: (ticket: Ticket) => void) => {
    console.log(`Subscribing to updates for ticket ${id}`);
    
    const channel = supabase
      .channel(`ticket-${id}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'tickets',
        filter: `id=eq.${id}`
      }, (payload) => {
        console.log('Received real-time update:', payload);
        if (payload.new) {
          const updatedTicket = {
            ...payload.new,
            status: payload.new.status as "open" | "inProgress" | "resolved"
          };
          
          // Update the local state
          setTickets(prevTickets =>
            prevTickets.map(ticket => 
              ticket.id === id ? updatedTicket : ticket
            )
          );
          
          // Call the callback with the updated ticket
          callback(updatedTicket);
        }
      })
      .subscribe();
    
    // Return a cleanup function to unsubscribe when component unmounts
    return () => {
      console.log(`Unsubscribing from updates for ticket ${id}`);
      supabase.removeChannel(channel);
    };
  };

  return (
    <TicketContext.Provider value={{ tickets, addTicket, updateTicket, getTicketById, subscribeToTicket }}>
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
