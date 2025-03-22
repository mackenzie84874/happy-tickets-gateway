
import { supabase } from "@/integrations/supabase/client";
import { TicketReply } from "@/types/ticket";

export const createReply = async (
  ticketId: string, 
  adminName: string, 
  message: string
): Promise<TicketReply | undefined> => {
  console.log(`Creating reply for ticket ${ticketId} from ${adminName}`);
  
  try {
    const { data, error } = await supabase
      .from('ticket_replies')
      .insert([{
        ticket_id: ticketId,
        admin_name: adminName,
        message: message
      }])
      .select();

    if (error) {
      console.error("Error creating reply in Supabase:", error);
      throw new Error(`Failed to add reply: ${error.message || error.details || "Unknown error"}`);
    }

    if (data && data.length > 0) {
      console.log("Reply created successfully:", data[0]);
      return data[0] as TicketReply;
    } else {
      throw new Error("No data returned after creating reply");
    }
  } catch (err) {
    console.error("Error in createReply function:", err);
    throw err;
  }
};

export const fetchReplies = async (ticketId: string): Promise<TicketReply[]> => {
  const { data, error } = await supabase
    .from('ticket_replies')
    .select('*')
    .eq('ticket_id', ticketId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error("Error fetching replies from Supabase:", error);
    throw error;
  }

  return data as TicketReply[] || [];
};
