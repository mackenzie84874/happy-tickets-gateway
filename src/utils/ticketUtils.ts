
import { supabase } from "@/integrations/supabase/client";
import { Ticket } from "@/types/ticket";

export const fetchTickets = async (): Promise<Ticket[]> => {
  const { data, error } = await supabase
    .from('tickets')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  if (data) {
    // Convert status to the correct type
    return data.map(ticket => ({
      ...ticket,
      status: ticket.status as "open" | "inProgress" | "resolved"
    }));
  }
  
  return [];
};

export const fetchTicketById = async (id: string): Promise<Ticket | undefined> => {
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
  
  return undefined;
};

export const createTicket = async (ticketData: Omit<Ticket, "id" | "created_at">): Promise<Ticket | undefined> => {
  const { data, error } = await supabase
    .from('tickets')
    .insert([ticketData])
    .select()
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
  
  return undefined;
};

export const updateTicketStatus = async (updatedTicket: Ticket): Promise<void> => {
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
};

export const subscribeToTicketUpdates = (id: string, callback: (ticket: Ticket) => void) => {
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
        // Ensure we're creating a properly typed Ticket object
        const updatedTicket: Ticket = {
          id: payload.new.id,
          name: payload.new.name,
          email: payload.new.email,
          subject: payload.new.subject,
          message: payload.new.message,
          status: payload.new.status as "open" | "inProgress" | "resolved",
          created_at: payload.new.created_at
        };
        
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
