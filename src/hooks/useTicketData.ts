
import { useState, useEffect, useCallback } from "react";
import { useTickets } from "@/hooks/useTicketContext";
import { Ticket, TicketReply } from "@/types/ticket";
import { useToast } from "@/components/ui/use-toast";
import { fetchReplies, subscribeToReplies } from "@/utils/ticketUtils";

interface UseTicketDataParams {
  ticketId: string | null;
}

interface UseTicketDataReturn {
  ticket: Ticket | null;
  loading: boolean;
  error: string | null;
  isUpdating: boolean;
  replies: TicketReply[];
  repliesLoading: boolean;
}

export const useTicketData = ({ ticketId }: UseTicketDataParams): UseTicketDataReturn => {
  const { getTicketById, subscribeToTicket } = useTickets();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [replies, setReplies] = useState<TicketReply[]>([]);
  const [repliesLoading, setRepliesLoading] = useState(true);
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

  // Callback for real-time replies
  const handleNewReply = useCallback((newReply: TicketReply) => {
    console.log('Handling new reply:', newReply);
    
    // Show toast notification for new reply
    toast({
      title: "New Reply",
      description: `${newReply.admin_name} has replied to your ticket.`,
    });
    
    // Add the new reply to the replies state
    setReplies(prev => [...prev, newReply]);
    
    // Visual feedback for the update
    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
    }, 2000);
  }, [toast]);

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

  // Load ticket replies
  useEffect(() => {
    const loadReplies = async () => {
      if (!ticketId) return;
      
      setRepliesLoading(true);
      try {
        const ticketReplies = await fetchReplies(ticketId);
        setReplies(ticketReplies);
      } catch (err) {
        console.error("Error fetching ticket replies:", err);
        // Don't set an error, just show empty replies
      } finally {
        setRepliesLoading(false);
      }
    };
    
    loadReplies();
  }, [ticketId]);

  // Subscribe to ticket updates
  useEffect(() => {
    if (ticketId && !loading) {
      // Subscribe to real-time updates
      const unsubscribe = subscribeToTicket(ticketId, handleTicketUpdate);
      
      // Clean up subscription on unmount
      return unsubscribe;
    }
  }, [ticketId, loading, subscribeToTicket, handleTicketUpdate]);

  // Subscribe to reply updates
  useEffect(() => {
    if (ticketId && !repliesLoading) {
      // Subscribe to real-time updates for replies
      const unsubscribe = subscribeToReplies(ticketId, handleNewReply);
      
      // Clean up subscription on unmount
      return unsubscribe;
    }
  }, [ticketId, repliesLoading, handleNewReply]);

  return { 
    ticket, 
    loading, 
    error, 
    isUpdating,
    replies,
    repliesLoading
  };
};
