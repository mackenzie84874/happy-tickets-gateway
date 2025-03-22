
import { useState, useEffect, useCallback } from "react";
import { useTickets } from "@/hooks/useTicketContext";
import { Ticket } from "@/types/ticket";

interface UseTicketDataParams {
  ticketId: string | null;
}

interface UseTicketDataReturn {
  ticket: Ticket | null;
  loading: boolean;
  error: string | null;
  isUpdating: boolean;
}

export const useTicketData = ({ ticketId }: UseTicketDataParams): UseTicketDataReturn => {
  const { getTicketById, subscribeToTicket } = useTickets();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Callback for real-time updates
  const handleTicketUpdate = useCallback((updatedTicket: Ticket) => {
    console.log('Handling ticket update:', updatedTicket);
    setTicket(updatedTicket);
    setIsUpdating(true);
    
    // Visual feedback for the update
    setTimeout(() => {
      setIsUpdating(false);
    }, 2000);
  }, []);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        if (!ticketId) {
          setError("No ticket ID provided");
          setLoading(false);
          return;
        }

        const fetchedTicket = await getTicketById(ticketId);
        if (fetchedTicket) {
          setTicket(fetchedTicket);
        } else {
          setError("Ticket not found");
        }
      } catch (err) {
        console.error("Error fetching ticket details:", err);
        setError("Error loading ticket details");
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [ticketId, getTicketById]);

  // Set up real-time subscription when ticket is loaded
  useEffect(() => {
    if (ticketId && !loading) {
      // Subscribe to real-time updates
      const unsubscribe = subscribeToTicket(ticketId, handleTicketUpdate);
      
      // Clean up subscription on unmount
      return unsubscribe;
    }
  }, [ticketId, loading, subscribeToTicket, handleTicketUpdate]);

  return { ticket, loading, error, isUpdating };
};
