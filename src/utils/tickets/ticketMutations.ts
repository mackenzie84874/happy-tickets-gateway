
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
      return;
    }
  }
  
  try {
    // Log the status for debugging
    console.log("Updating ticket status to:", updatedTicket.status);
    
    // Use RPC function to update the status - this converts the string to enum properly
    const { error: rpcError } = await supabase.rpc('force_update_ticket_status', {
      ticket_id: updatedTicket.id,
      new_status: updatedTicket.status
    });
    
    if (rpcError) {
      console.error("Error in force_update_ticket_status:", rpcError);
      
      // Fallback to direct update if RPC fails
      const { error } = await supabase
        .from('tickets')
        .update({
          status: updatedTicket.status
        })
        .eq('id', updatedTicket.id);

      if (error) {
        console.error("Error updating ticket in Supabase:", error);
        throw error;
      }
    }
    
    // Verify the update was successful
    const { data: verifyUpdate } = await supabase
      .from('tickets')
      .select('id, status')
      .eq('id', updatedTicket.id)
      .single();
      
    console.log(`Ticket ${updatedTicket.id} updated to status:`, verifyUpdate?.status);
  } catch (err) {
    console.error("Error updating ticket status:", err);
    throw err;
  }
};
