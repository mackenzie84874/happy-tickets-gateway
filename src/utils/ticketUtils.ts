import { supabase } from "@/integrations/supabase/client";
import { Ticket, TicketReply } from "@/types/ticket";

export const fetchTickets = async (): Promise<Ticket[]> => {
  const { data, error } = await supabase
    .from('tickets')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching tickets:", error);
    throw error;
  }

  if (data) {
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
    console.error("Error fetching ticket by ID:", error);
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
  console.log("Creating ticket with data:", ticketData);
  
  try {
    const { data, error } = await supabase
      .from('tickets')
      .insert([{
        name: ticketData.name,
        email: ticketData.email,
        subject: ticketData.subject,
        message: ticketData.message,
        status: ticketData.status || 'open',
      }])
      .select();

    if (error) {
      console.error("Supabase error creating ticket:", error);
      throw new Error(`Failed to create ticket: ${error.message || error.details || "Unknown error"}`);
    }

    if (data && data.length > 0) {
      console.log("Ticket created successfully:", data[0]);
      return {
        ...data[0],
        status: data[0].status as "open" | "inProgress" | "resolved"
      };
    } else {
      throw new Error("No data returned after ticket creation");
    }
  } catch (err) {
    console.error("Error in createTicket function:", err);
    throw err;
  }
};

export const updateTicketStatus = async (updatedTicket: Ticket): Promise<void> => {
  const validStatus = ["open", "inProgress", "resolved", "closed"].includes(updatedTicket.status) 
    ? updatedTicket.status
    : "open";
    
  const { error } = await supabase
    .from('tickets')
    .update({
      name: updatedTicket.name,
      email: updatedTicket.email,
      subject: updatedTicket.subject,
      message: updatedTicket.message,
      status: validStatus,
      rating: updatedTicket.rating
    })
    .eq('id', updatedTicket.id);

  if (error) {
    console.error("Error updating ticket in Supabase:", error);
    throw error;
  }
  
  console.log(`Ticket ${updatedTicket.id} updated to status: ${validStatus}`);
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
        const updatedTicket: Ticket = {
          id: payload.new.id,
          name: payload.new.name,
          email: payload.new.email,
          subject: payload.new.subject,
          message: payload.new.message,
          status: payload.new.status as "open" | "inProgress" | "resolved",
          created_at: payload.new.created_at
        };
        
        callback(updatedTicket);
      }
    })
    .subscribe();
  
  return () => {
    console.log(`Unsubscribing from updates for ticket ${id}`);
    supabase.removeChannel(channel);
  };
};

export const createReply = async (
  ticketId: string, 
  adminName: string, 
  message: string
): Promise<TicketReply | undefined> => {
  console.log(`Creating reply for ticket ${ticketId} from ${adminName}`);
  
  try {
    const { data, error } = await supabase
      .from('ticket_replies')
      .insert([{
        ticket_id: ticketId,
        admin_name: adminName,
        message: message
      }])
      .select();

    if (error) {
      console.error("Error creating reply in Supabase:", error);
      throw new Error(`Failed to add reply: ${error.message || error.details || "Unknown error"}`);
    }

    if (data && data.length > 0) {
      console.log("Reply created successfully:", data[0]);
      return data[0] as TicketReply;
    } else {
      throw new Error("No data returned after creating reply");
    }
  } catch (err) {
    console.error("Error in createReply function:", err);
    throw err;
  }
};

export const fetchReplies = async (ticketId: string): Promise<TicketReply[]> => {
  const { data, error } = await supabase
    .from('ticket_replies')
    .select('*')
    .eq('ticket_id', ticketId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error("Error fetching replies from Supabase:", error);
    throw error;
  }

  return data as TicketReply[] || [];
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
    .subscribe();
  
  return () => {
    console.log(`Unsubscribing from replies for ticket ${ticketId}`);
    supabase.removeChannel(channel);
  };
};
