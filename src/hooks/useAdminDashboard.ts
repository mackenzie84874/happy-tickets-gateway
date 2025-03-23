
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTickets } from "@/hooks/useTicketContext";
import { Ticket, TicketStatusCounts } from "@/types/ticket";

export const useAdminDashboard = () => {
  const navigate = useNavigate();
  const { tickets } = useTickets();
  const [isAdmin, setIsAdmin] = useState(false);
  const [filter, setFilter] = useState<"all" | "open" | "inProgress" | "resolved" | "closed">("all"); // Default to "all" filter
  const [showResolved, setShowResolved] = useState(true); // Default to showing all tickets including resolved
  const [isLoading, setIsLoading] = useState(true);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  
  // Get the list of deleted tickets from localStorage
  const getDeletedTicketIds = () => {
    return JSON.parse(localStorage.getItem('deletedTickets') || '[]');
  };
  
  useEffect(() => {
    // Check if user is logged in as admin
    const adminStatus = localStorage.getItem("isAdmin");
    if (adminStatus !== "true") {
      navigate("/admin");
    } else {
      setIsAdmin(true);
    }
    
    // Set loading to false after a short delay to simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [navigate]);
  
  // Filter tickets when tickets, filter, or showResolved changes
  useEffect(() => {
    const deletedTicketIds = getDeletedTicketIds();
    
    // First filter out any deleted tickets
    const availableTickets = tickets.filter(ticket => !deletedTicketIds.includes(ticket.id));
    
    // Then apply the other filters
    const result = availableTickets
      .filter(ticket => {
        if (!showResolved) {
          return ticket.status !== "resolved" && ticket.status !== "closed";
        }
        return true;
      })
      .filter(ticket => {
        if (filter === "all") return true;
        return ticket.status === filter;
      });
    
    setFilteredTickets(result);
    
    console.log("Filtered tickets:", result.length);
    if (result.length > 0) {
      console.log("Ticket details:", result.map(t => ({
        id: t.id,
        subject: t.subject,
        status: t.status
      })));
    }
  }, [tickets, filter, showResolved]);
  
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
  
  // Count tickets by status - make sure to exclude deleted tickets
  const countByStatus = tickets.reduce((counts, ticket) => {
    const deletedTicketIds = getDeletedTicketIds();
    if (!deletedTicketIds.includes(ticket.id)) {
      counts.all++;
      counts[ticket.status]++;
    }
    return counts;
  }, {
    all: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
  } as TicketStatusCounts);

  return {
    isAdmin,
    filter,
    setFilter,
    showResolved,
    setShowResolved,
    filteredTickets,
    countByStatus,
    handleLogout,
    isLoading
  };
};
