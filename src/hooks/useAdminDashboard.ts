
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTickets } from "@/hooks/useTicketContext";
import { Ticket, TicketStatusCounts } from "@/types/ticket";
import { fetchTickets } from "@/utils/tickets";
import { supabase } from "@/integrations/supabase/client";

export const useAdminDashboard = () => {
  const navigate = useNavigate();
  const { tickets: allTickets, updateTicket } = useTickets();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [filter, setFilter] = useState<"all" | "open" | "inProgress" | "resolved" | "closed">("open"); // Default to "open" filter
  const [showResolved, setShowResolved] = useState(false); // Default to NOT showing resolved/closed tickets
  const [isLoading, setIsLoading] = useState(true);
  
  // Use this callback to refresh tickets
  const refreshTickets = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log(`Refreshing tickets with filter: ${filter}`);
      const freshTickets = await fetchTickets(filter === "all" ? undefined : filter);
      console.log(`Refreshed ${freshTickets.length} tickets with filter ${filter}`);
      setTickets(freshTickets);
    } catch (error) {
      console.error("Error refreshing tickets:", error);
    } finally {
      setIsLoading(false);
    }
  }, [filter]);
  
  useEffect(() => {
    // Check if user is logged in as admin
    const adminStatus = localStorage.getItem("isAdmin");
    if (adminStatus !== "true") {
      navigate("/admin");
    } else {
      setIsAdmin(true);
    }
    
    // Initial data load
    refreshTickets();
    
    // Set up real-time subscription for ticket updates
    const channel = supabase
      .channel('tickets-changes')
      .on('postgres_changes', {
        event: '*', 
        schema: 'public',
        table: 'tickets'
      }, (payload) => {
        console.log('Real-time update received:', payload);
        // Refresh tickets when any change happens
        refreshTickets();
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [navigate, refreshTickets]);
  
  // Handle filter changes
  useEffect(() => {
    refreshTickets();
  }, [filter, refreshTickets]);
  
  // Debug - log all tickets and their statuses
  useEffect(() => {
    if (tickets.length > 0) {
      console.log("Current tickets in admin dashboard:", tickets.map(t => ({
        id: t.id,
        subject: t.subject,
        status: t.status
      })));
    }
  }, [tickets]);
  
  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    navigate("/admin");
  };
  
  // Apply filters correctly for display
  const filteredTickets = showResolved 
    ? tickets 
    : tickets.filter(ticket => ticket.status !== "resolved" && ticket.status !== "closed");
  
  // Count tickets by status
  const countByStatus: TicketStatusCounts = {
    all: allTickets.length,
    open: allTickets.filter(ticket => ticket.status === "open").length,
    inProgress: allTickets.filter(ticket => ticket.status === "inProgress").length,
    resolved: allTickets.filter(ticket => ticket.status === "resolved").length,
    closed: allTickets.filter(ticket => ticket.status === "closed").length,
  };

  return {
    isAdmin,
    filter,
    setFilter,
    showResolved,
    setShowResolved,
    filteredTickets,
    countByStatus,
    handleLogout,
    isLoading,
    refreshTickets
  };
};
