
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
        status: data[0].status as "open" | "inProgress" | "resolved"
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
  const validStatus = ["open", "inProgress", "resolved", "closed"].includes(updatedTicket.status) 
    ? updatedTicket.status
    : "open";
    
  const { error } = await supabase
    .from('tickets')
    .update({
      name: updatedTicket.name,
      email: updatedTicket.email,
      subject: updatedTicket.subject,
      message: updatedTicket.message,
      status: validStatus,
      rating: updatedTicket.rating
    })
    .eq('id', updatedTicket.id);

  if (error) {
    console.error("Error updating ticket in Supabase:", error);
    throw error;
  }
  
  console.log(`Ticket ${updatedTicket.id} updated to status: ${validStatus}`);
};
