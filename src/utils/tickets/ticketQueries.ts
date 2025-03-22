import { supabase } from "@/integrations/supabase/client";
import { Ticket } from "@/types/ticket";

export const fetchTickets = async (): Promise<Ticket[]> => {
  console.log("Fetching all tickets from database");
  
  // Check if table has the correct columns and data
  const { data: tableInfo, error: tableError } = await supabase
    .from('tickets')
    .select('id, status')
    .limit(5);
    
  if (tableInfo) {
    console.log("Sample database ticket data:", tableInfo);
  }
  
  const { data, error } = await supabase
    .from('tickets')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching tickets:", error);
    throw error;
  }

  if (data) {
    // Process the tickets without modifying their status
    const tickets = data.map(ticket => ({
      ...ticket,
      // Keep the status exactly as it comes from the database
      status: ticket.status as "open" | "inProgress" | "resolved" | "closed"
    }));
    
    // Debug: Log all fetched tickets and their statuses
    console.log("Fetched tickets with statuses:", tickets.map(t => ({
      id: t.id,
      subject: t.subject,
      status: t.status
    })));
    
    return tickets;
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
      // Keep the status exactly as it comes from the database
      status: data.status as "open" | "inProgress" | "resolved" | "closed"
    };
  }
  
  return undefined;
};
