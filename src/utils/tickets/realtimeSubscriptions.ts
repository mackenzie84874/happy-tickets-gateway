
import { supabase } from "@/integrations/supabase/client";
import { Ticket, TicketReply } from "@/types/ticket";

export const subscribeToTicketUpdates = (id: string, callback: (ticket: Ticket) => void) => {
  console.log(`Setting up real-time subscription for ticket ${id}`);
  
  const channel = supabase
    .channel(`ticket-${id}`)
    .on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'tickets',
      filter: `id=eq.${id}`
    }, (payload) => {
      console.log('Received real-time update for ticket:', payload);
      if (payload.new) {
        const updatedTicket: Ticket = {
          id: payload.new.id,
          name: payload.new.name,
          email: payload.new.email,
          subject: payload.new.subject,
          message: payload.new.message,
          status: payload.new.status as "open" | "inProgress" | "resolved" | "closed",
          created_at: payload.new.created_at,
          rating: payload.new.rating
        };
        
        console.log('Calling callback with updated ticket data:', updatedTicket);
        callback(updatedTicket);
      }
    })
    .subscribe((status) => {
      console.log(`Subscription status for ticket ${id}:`, status);
    });
  
  return () => {
    console.log(`Unsubscribing from updates for ticket ${id}`);
    supabase.removeChannel(channel);
  };
};

export const subscribeToTicketList = (callback: (ticket: Ticket) => void) => {
  console.log('Setting up real-time subscription for all tickets');
  
  const channel = supabase
    .channel('tickets-list')
    .on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'tickets'
    }, (payload) => {
      console.log('Received real-time update for tickets list:', payload);
      if (payload.new) {
        const updatedTicket: Ticket = {
          id: payload.new.id,
          name: payload.new.name,
          email: payload.new.email,
          subject: payload.new.subject,
          message: payload.new.message,
          status: payload.new.status as "open" | "inProgress" | "resolved" | "closed",
          created_at: payload.new.created_at,
          rating: payload.new.rating
        };
        
        console.log('Calling callback with updated ticket list data:', updatedTicket);
        callback(updatedTicket);
      }
    })
    .subscribe((status) => {
      console.log('Tickets list subscription status:', status);
    });
  
  return () => {
    console.log('Unsubscribing from tickets list updates');
    supabase.removeChannel(channel);
  };
};

export const subscribeToReplies = (ticketId: string, callback: (reply: TicketReply) => void) => {
  console.log(`Subscribing to replies for ticket ${ticketId}`);
  
  const channel = supabase
    .channel(`replies-${ticketId}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'ticket_replies',
      filter: `ticket_id=eq.${ticketId}`
    }, (payload) => {
      console.log('Received new reply:', payload);
      if (payload.new) {
        callback(payload.new as TicketReply);
      }
    })
    .subscribe((status) => {
      console.log(`Reply subscription status for ticket ${ticketId}:`, status);
    });
  
  return () => {
    console.log(`Unsubscribing from replies for ticket ${ticketId}`);
    supabase.removeChannel(channel);
  };
};
