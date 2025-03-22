
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

export const updateTicketStatus = async (updatedTicket: Ticket): Promise<Ticket> => {
  console.log("updateTicketStatus called with ticket:", {
    id: updatedTicket.id,
    status: updatedTicket.status,
    current_time: new Date().toISOString()
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
      return updatedTicket;
    }
  }
  
  try {
    // For debugging - log the exact value we're sending
    console.log("Status being updated:", updatedTicket.status);
    console.log("Type of status:", typeof updatedTicket.status);
    
    // Prioritize the RPC function for the most reliable update
    const { error: rpcError } = await supabase.rpc('force_update_ticket_status', {
      ticket_id: updatedTicket.id,
      new_status: updatedTicket.status
    });
    
    if (rpcError) {
      console.error("Error in force_update_ticket_status:", rpcError);
      
      // Fallback to standard update if RPC fails
      const { data, error } = await supabase
        .from('tickets')
        .update({
          status: updatedTicket.status,
          name: updatedTicket.name,
          email: updatedTicket.email,
          subject: updatedTicket.subject,
          message: updatedTicket.message,
          rating: updatedTicket.rating
        })
        .eq('id', updatedTicket.id)
        .select();

      if (error) {
        console.error("Error updating ticket in Supabase:", error);
        throw error;
      }
      
      if (data && data.length > 0) {
        console.log("Ticket updated through standard update:", data[0]);
        return {
          ...data[0],
          status: data[0].status as "open" | "inProgress" | "resolved" | "closed"
        };
      }
    } else {
      console.log("Status updated successfully via force_update_ticket_status");
    }
    
    // After update, fetch the latest data to ensure we have the current state
    const { data: verifyUpdate, error: verifyError } = await supabase
      .from('tickets')
      .select('*')
      .eq('id', updatedTicket.id)
      .single();
      
    if (verifyError) {
      console.error("Error verifying ticket update:", verifyError);
      throw verifyError;
    }
    
    if (verifyUpdate) {
      console.log(`Ticket ${updatedTicket.id} verified status:`, verifyUpdate.status);
      console.log("Updated ticket data:", verifyUpdate);
      
      return {
        ...verifyUpdate,
        status: verifyUpdate.status as "open" | "inProgress" | "resolved" | "closed"
      };
    }
    
    // If we couldn't verify but no errors occurred, return the original updated ticket
    return updatedTicket;
  } catch (err) {
    console.error("Error updating ticket status:", err);
    throw err;
  }
};
