
import { useState, useEffect, useCallback, useRef } from "react";
import { useTickets } from "@/hooks/useTicketContext";
import { Ticket, TicketReply } from "@/types/ticket";
import { useToast } from "@/hooks/use-toast";
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
  const subscriptionsActive = useRef<boolean>(false);

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
      } else if (updatedTicket.status === "closed") {
        statusMessage = "Your ticket has been closed.";
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
    setReplies(prev => {
      // Check if the reply is already in the array to avoid duplicates
      const exists = prev.some(reply => reply.id === newReply.id);
      if (exists) return prev;
      return [...prev, newReply];
    });
    
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

        console.log("Fetching ticket data for ID:", ticketId);
        const fetchedTicket = await getTicketById(ticketId);
        if (fetchedTicket) {
          console.log("Ticket data retrieved:", fetchedTicket);
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
        console.log("Fetching replies for ticket:", ticketId);
        const ticketReplies = await fetchReplies(ticketId);
        console.log("Fetched replies:", ticketReplies);
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
    if (ticketId && !loading && !subscriptionsActive.current) {
      console.log("Setting up subscriptions for ticket:", ticketId);
      subscriptionsActive.current = true;
      
      // Subscribe to real-time updates
      const unsubscribeTicket = subscribeToTicket(ticketId, handleTicketUpdate);
      
      // Subscribe to real-time updates for replies
      const unsubscribeReplies = subscribeToReplies(ticketId, handleNewReply);
      
      // Clean up subscriptions on unmount
      return () => {
        console.log("Cleaning up subscriptions for ticket:", ticketId);
        unsubscribeTicket();
        unsubscribeReplies();
        subscriptionsActive.current = false;
      };
    }
  }, [ticketId, loading, subscribeToTicket, handleTicketUpdate, handleNewReply]);

  return { 
    ticket, 
    loading, 
    error, 
    isUpdating,
    replies,
    repliesLoading
  };
};
