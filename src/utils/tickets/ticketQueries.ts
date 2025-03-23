
import { supabase } from "@/integrations/supabase/client";
import { Ticket } from "@/types/ticket";

export const fetchTickets = async (): Promise<Ticket[]> => {
  console.log("Fetching all tickets from database");
  
  // Check if table has the correct columns and data
  const { data: tableInfo, error: tableError } = await supabase
    .from('tickets')
    .select('id, status, rating')
    .limit(5);
    
  if (tableInfo) {
    console.log("Sample database ticket data:", tableInfo);
  }
  
  // Fetch all tickets with explicit ordering
  const { data, error } = await supabase
    .from('tickets')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching tickets:", error);
    throw error;
  }

  if (data) {
    // Process the tickets preserving their exact database status
    const tickets = data.map(ticket => ({
      ...ticket,
      // Keep the status exactly as it comes from the database
      status: ticket.status as "open" | "inProgress" | "resolved" | "closed",
      // Make sure to include the rating
      rating: ticket.rating
    }));
    
    // Debug: Log all fetched tickets and their statuses
    console.log("Fetched tickets with statuses and ratings:", tickets.map(t => ({
      id: t.id,
      subject: t.subject,
      status: t.status,
      rating: t.rating
    })));
    
    // Filter out any permanently deleted tickets
    const deletedTicketIds = JSON.parse(localStorage.getItem('deletedTickets') || '[]');
    if (deletedTicketIds.length > 0) {
      return tickets.filter(ticket => !deletedTicketIds.includes(ticket.id));
    }
    
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
    // Check if this ticket is in the deleted list
    const deletedTicketIds = JSON.parse(localStorage.getItem('deletedTickets') || '[]');
    if (deletedTicketIds.includes(data.id)) {
      return undefined; // Return undefined for deleted tickets
    }
    
    return {
      ...data,
      // Keep the status exactly as it comes from the database
      status: data.status as "open" | "inProgress" | "resolved" | "closed",
      // Make sure to include the rating
      rating: data.rating
    };
  }
  
  return undefined;
};
