
import { supabase } from "@/integrations/supabase/client";
import { Ticket } from "@/types/ticket";

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
      status: ticket.status as "open" | "inProgress" | "resolved" | "closed"
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
      status: data.status as "open" | "inProgress" | "resolved" | "closed"
    };
  }
  
  return undefined;
};

export const fetchTicketsByStatus = async (status: "open" | "inProgress" | "resolved" | "closed" | "all"): Promise<Ticket[]> => {
  let query = supabase
    .from('tickets')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (status !== "all") {
    query = query.eq('status', status);
  }
  
  const { data, error } = await query;

  if (error) {
    console.error(`Error fetching tickets with status ${status}:`, error);
    throw error;
  }

  if (data) {
    return data.map(ticket => ({
      ...ticket,
      status: ticket.status as "open" | "inProgress" | "resolved" | "closed"
    }));
  }
  
  return [];
};
