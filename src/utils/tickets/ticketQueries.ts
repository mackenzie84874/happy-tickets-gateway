
import { supabase } from "@/integrations/supabase/client";
import { Ticket } from "@/types/ticket";

export const fetchTickets = async (status?: "open" | "inProgress" | "resolved" | "closed"): Promise<Ticket[]> => {
  console.log(`Fetching tickets${status ? ` with status: ${status}` : ''} from database`);
  
  // Check if table has the correct columns and data
  const { data: tableInfo, error: tableError } = await supabase
    .from('tickets')
    .select('id, status')
    .limit(5);
    
  if (tableInfo) {
    console.log("Sample database ticket data:", tableInfo);
  }
  
  // Build the query
  let query = supabase.from('tickets').select('*');
  
  // Apply status filter if provided
  if (status) {
    query = query.eq('status', status);
  }
  
  // Execute the query with ordering
  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching tickets:", error);
    throw error;
  }

  if (data) {
    console.log(`Raw ticket data from database (${data.length} tickets):`, data);
    
    // Process the tickets preserving their exact database status
    const tickets = data.map(ticket => ({
      ...ticket,
      // Ensure status is one of the valid enum values
      status: ticket.status as "open" | "inProgress" | "resolved" | "closed"
    }));
    
    // Debug: Log all fetched tickets and their statuses
    console.log("Processed tickets with statuses:", tickets.map(t => ({
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
    console.log("Fetched individual ticket data:", data);
    
    return {
      ...data,
      // Ensure status is one of the valid enum values
      status: data.status as "open" | "inProgress" | "resolved" | "closed"
    };
  }
  
  return undefined;
};
