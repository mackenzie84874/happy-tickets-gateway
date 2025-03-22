
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
    // Convert string statuses to our expected types and log them
    const formattedTickets = data.map(ticket => {
      const validStatuses = ["open", "inProgress", "resolved", "closed"];
      // Make sure the status is valid, defaulting to "open" if not
      const validStatus = validStatuses.includes(ticket.status) 
        ? ticket.status 
        : "open";
        
      return {
        ...ticket,
        status: validStatus as "open" | "inProgress" | "resolved" | "closed"
      };
    });
    
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
    const validStatuses = ["open", "inProgress", "resolved", "closed"];
    // Make sure the status is valid, defaulting to "open" if not
    const validStatus = validStatuses.includes(data.status) 
      ? data.status 
      : "open";
      
    return {
      ...data,
      status: validStatus as "open" | "inProgress" | "resolved" | "closed"
    };
  }
  
  return undefined;
};
