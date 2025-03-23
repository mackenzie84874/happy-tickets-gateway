
import { useState, useEffect, useCallback, useRef } from "react";
import { useTickets } from "@/hooks/useTicketContext";
import { Ticket, TicketReply } from "@/types/ticket";
import { useToast } from "@/hooks/use-toast";
import { fetchReplies, subscribeToReplies } from "@/utils/tickets";

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
  const localRepliesCache = useRef<TicketReply[]>([]);

  const handleTicketUpdate = useCallback((updatedTicket: Ticket) => {
    console.log('Handling ticket update:', updatedTicket);
    
    if (ticket && ticket.status !== updatedTicket.status) {
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
    
    setTicket(updatedTicket);
    setIsUpdating(true);
    
    setTimeout(() => {
      setIsUpdating(false);
    }, 2000);
  }, [ticket, toast]);

  const handleNewReply = useCallback((newReply: TicketReply) => {
    console.log('Handling new reply:', newReply);
    
    // Only show toast notification for admin replies, not for guest's own messages
    if (!newReply.is_from_guest) {
      toast({
        title: "New Reply",
        description: `${newReply.admin_name} has replied to your ticket.`,
      });
    }
    
    setReplies(prev => {
      const exists = prev.some(reply => reply.id === newReply.id);
      if (exists) return prev;
      
      // Update our local cache as well for persistence
      const updatedReplies = [...prev, newReply];
      localRepliesCache.current = updatedReplies;
      
      return updatedReplies;
    });
    
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

  useEffect(() => {
    const loadReplies = async () => {
      if (!ticketId) return;
      
      setRepliesLoading(true);
      try {
        console.log("Fetching replies for ticket:", ticketId);
        const ticketReplies = await fetchReplies(ticketId);
        console.log("Fetched replies:", ticketReplies);
        setReplies(ticketReplies);
        
        // Cache replies locally for persistence
        localRepliesCache.current = ticketReplies;
      } catch (err) {
        console.error("Error fetching ticket replies:", err);
        // If we have cached replies, use them as fallback
        if (localRepliesCache.current.length > 0) {
          setReplies(localRepliesCache.current);
        }
      } finally {
        setRepliesLoading(false);
      }
    };
    
    loadReplies();
  }, [ticketId]);

  useEffect(() => {
    if (ticketId && !loading && !subscriptionsActive.current) {
      console.log("Setting up subscriptions for ticket:", ticketId);
      subscriptionsActive.current = true;
      
      const unsubscribeTicket = subscribeToTicket(ticketId, handleTicketUpdate);
      
      const unsubscribeReplies = subscribeToReplies(ticketId, handleNewReply);
      
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
