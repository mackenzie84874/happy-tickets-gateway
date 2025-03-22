
import { supabase } from "@/integrations/supabase/client";
import { Ticket } from "@/types/ticket";

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
        status: data[0].status as "open" | "inProgress" | "resolved" | "closed"
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
  console.log("updateTicketStatus called with ticket:", {
    id: updatedTicket.id,
    status: updatedTicket.status
  });
  
  // If ticket is closed, it cannot be changed to any other status
  if (updatedTicket.id) {
    const { data: existingTicket } = await supabase
      .from('tickets')
      .select('status')
      .eq('id', updatedTicket.id)
      .single();
    
    if (existingTicket && existingTicket.status === "closed") {
      console.log(`Ticket ${updatedTicket.id} is already closed and cannot be changed.`);
      return;
    }
  }
  
  // Only accept valid statuses
  const validStatuses = ["open", "inProgress", "resolved", "closed"];
  const validStatus = validStatuses.includes(updatedTicket.status) 
    ? updatedTicket.status
    : "open";
    
  // Log the status before update for debugging
  console.log(`Updating ticket ${updatedTicket.id} status to: ${validStatus}`);
  
  // Verify actual table structure in database
  const { data: tableStructure, error: tableError } = await supabase
    .from('tickets')
    .select('id, status')
    .eq('id', updatedTicket.id)
    .single();
    
  if (tableStructure) {
    console.log("Current ticket state in database:", tableStructure);
  }
  
  // Perform the update with explicit status conversion
  const { error, data } = await supabase
    .from('tickets')
    .update({
      name: updatedTicket.name,
      email: updatedTicket.email,
      subject: updatedTicket.subject,
      message: updatedTicket.message,
      status: validStatus, // Ensure this is explicitly set as a string
      rating: updatedTicket.rating
    })
    .eq('id', updatedTicket.id)
    .select();

  if (error) {
    console.error("Error updating ticket in Supabase:", error);
    throw error;
  }
  
  // Verify the update worked
  const { data: verifyUpdate } = await supabase
    .from('tickets')
    .select('id, status')
    .eq('id', updatedTicket.id)
    .single();
    
  console.log(`Ticket ${updatedTicket.id} updated to status: ${validStatus}`, data);
  console.log("Updated ticket verified in database:", verifyUpdate);
};
