import { useState, useEffect, useCallback } from "react";
import { useTickets } from "@/hooks/useTicketContext";
import { Ticket } from "@/types/ticket";
import { useToast } from "@/components/ui/use-toast";

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
  const { toast } = useToast();

  // Callback for real-time updates
  const handleTicketUpdate = useCallback((updatedTicket: Ticket) => {
    console.log('Handling ticket update:', updatedTicket);
    
    // Check if the status changed
    if (ticket && ticket.status !== updatedTicket.status) {
      // Show toast notification for status change
      let statusMessage = "Your ticket status has changed.";
      
      if (updatedTicket.status === "inProgress") {
        statusMessage = "An agent has accepted your ticket and is working on it.";
      } else if (updatedTicket.status === "resolved") {
        statusMessage = "Your ticket has been resolved.";
      }
      
      toast({
        title: "Ticket Updated",
        description: statusMessage,
      });
    }
    
    // Update the ticket state
    setTicket(updatedTicket);
    setIsUpdating(true);
    
    // Visual feedback for the update
    setTimeout(() => {
      setIsUpdating(false);
    }, 2000);
  }, [ticket, toast]);

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
