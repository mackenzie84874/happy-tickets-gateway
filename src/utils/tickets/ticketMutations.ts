
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
  
  // The critical issue: correctly update the status in the database
  console.log(`Updating ticket ${updatedTicket.id} status to: ${updatedTicket.status}`);
  
  try {
    // First attempt - use standard update
    const { error } = await supabase
      .from('tickets')
      .update({
        status: updatedTicket.status, // Use status directly without modification
        name: updatedTicket.name,
        email: updatedTicket.email,
        subject: updatedTicket.subject,
        message: updatedTicket.message,
        rating: updatedTicket.rating
      })
      .eq('id', updatedTicket.id);

    if (error) {
      console.error("Error updating ticket in Supabase:", error);
      throw error;
    }
    
    // Verify the update was successful by checking the current database state
    const { data: verifyUpdate } = await supabase
      .from('tickets')
      .select('id, status')
      .eq('id', updatedTicket.id)
      .single();
      
    console.log(`Ticket ${updatedTicket.id} updated to status: ${updatedTicket.status}`);
    console.log("Updated ticket verified in database:", verifyUpdate);
    
    // If verification shows status didn't update correctly, use the force_update function
    if (verifyUpdate && verifyUpdate.status !== updatedTicket.status) {
      console.log("Status didn't update correctly. Using direct SQL function.");
      
      // Use RPC call to force the update
      const { error: rpcError } = await supabase.rpc('force_update_ticket_status', {
        ticket_id: updatedTicket.id,
        new_status: updatedTicket.status
      });
      
      if (rpcError) {
        console.error("Error in force update:", rpcError);
        throw rpcError;
      } else {
        console.log("Force update executed successfully");
      }
    }
  } catch (err) {
    console.error("Error updating ticket status:", err);
    throw err;
  }
};

export const deleteTicket = async (ticketId: string): Promise<void> => {
  console.log(`Deleting ticket with ID: ${ticketId}`);
  
  try {
    // First delete all replies associated with the ticket
    const { error: repliesError } = await supabase
      .from('ticket_replies')
      .delete()
      .eq('ticket_id', ticketId);
    
    if (repliesError) {
      console.error("Error deleting ticket replies:", repliesError);
      throw new Error(`Failed to delete ticket replies: ${repliesError.message}`);
    }
    
    // Then delete the ticket itself
    const { error: ticketError } = await supabase
      .from('tickets')
      .delete()
      .eq('id', ticketId);
    
    if (ticketError) {
      console.error("Error deleting ticket:", ticketError);
      throw new Error(`Failed to delete ticket: ${ticketError.message}`);
    }
    
    console.log(`Successfully deleted ticket ${ticketId} and its replies`);
  } catch (err) {
    console.error("Error in deleteTicket function:", err);
    throw err;
  }
};

export const deleteTickets = async (ticketIds: string[]): Promise<void> => {
  console.log(`Deleting ${ticketIds.length} tickets`);
  
  if (ticketIds.length === 0) return;
  
  try {
    // Delete all replies for these tickets
    const { error: repliesError } = await supabase
      .from('ticket_replies')
      .delete()
      .in('ticket_id', ticketIds);
    
    if (repliesError) {
      console.error("Error deleting multiple ticket replies:", repliesError);
      throw new Error(`Failed to delete ticket replies: ${repliesError.message}`);
    }
    
    // Delete the tickets
    const { error: ticketsError } = await supabase
      .from('tickets')
      .delete()
      .in('id', ticketIds);
    
    if (ticketsError) {
      console.error("Error deleting multiple tickets:", ticketsError);
      throw new Error(`Failed to delete tickets: ${ticketsError.message}`);
    }
    
    console.log(`Successfully deleted ${ticketIds.length} tickets and their replies`);
  } catch (err) {
    console.error("Error in deleteTickets function:", err);
    throw err;
  }
};
