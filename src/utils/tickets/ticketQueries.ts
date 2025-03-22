
import { supabase } from "@/integrations/supabase/client";
import { Ticket } from "@/types/ticket";

export const fetchTickets = async (): Promise<Ticket[]> => {
  console.log("Fetching all tickets from database");
  
  const { data, error } = await supabase
    .from('tickets')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching tickets:", error);
    throw error;
  }

  if (data) {
    // Map the data and ensure status is properly converted
    const formattedTickets = data.map(ticket => ({
      ...ticket,
      status: ticket.status as "open" | "inProgress" | "resolved" | "closed"
    }));
    
    // Debug: Log all fetched tickets and their statuses
    console.log("Fetched tickets with statuses:", formattedTickets.map(t => ({
      id: t.id,
      subject: t.subject,
      status: t.status
    })));
    
    return formattedTickets;
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
      status: data.status as "open" | "inProgress" | "resolved" | "closed"
    };
  }
  
  return undefined;
};
