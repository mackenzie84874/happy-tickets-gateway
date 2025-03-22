import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTickets } from "@/hooks/useTicketContext";
import { Ticket, TicketStatusCounts } from "@/types/ticket";
import { fetchTickets } from "@/utils/tickets";

export const useAdminDashboard = () => {
  const navigate = useNavigate();
  const { tickets: allTickets, updateTicket } = useTickets();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [filter, setFilter] = useState<"all" | "open" | "inProgress" | "resolved" | "closed">("open"); // Default to "open" filter
  const [showResolved, setShowResolved] = useState(false); // Default to NOT showing resolved/closed tickets
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is logged in as admin
    const adminStatus = localStorage.getItem("isAdmin");
    if (adminStatus !== "true") {
      navigate("/admin");
    } else {
      setIsAdmin(true);
    }
    
    // Fetch only open tickets on initial load
    const fetchInitialTickets = async () => {
      try {
        setIsLoading(true);
        const openTickets = await fetchTickets("open");
        setTickets(openTickets);
      } catch (error) {
        console.error("Error fetching open tickets:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInitialTickets();
  }, [navigate]);
  
  // Handle filter changes
  useEffect(() => {
    const fetchFilteredTickets = async () => {
      try {
        setIsLoading(true);
        if (filter === "all") {
          // Fetch all tickets if "all" is selected and showResolved is true
          // Otherwise fetch only open and inProgress tickets
          if (showResolved) {
            setTickets(allTickets);
          } else {
            const openInProgressTickets = allTickets.filter(
              t => t.status === "open" || t.status === "inProgress"
            );
            setTickets(openInProgressTickets);
          }
        } else {
          // Fetch tickets with specific status
          const filteredTickets = await fetchTickets(filter);
          setTickets(filteredTickets);
        }
      } catch (error) {
        console.error(`Error fetching ${filter} tickets:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilteredTickets();
  }, [filter, showResolved, allTickets]);
  
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
    refreshTickets: async () => {
      setIsLoading(true);
      try {
        const freshTickets = await fetchTickets(filter === "all" ? undefined : filter);
        setTickets(freshTickets);
      } catch (error) {
        console.error("Error refreshing tickets:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };
};
