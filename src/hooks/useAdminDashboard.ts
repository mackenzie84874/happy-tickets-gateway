
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTickets } from "@/hooks/useTicketContext";
import { Ticket, TicketStatusCounts } from "@/types/ticket";

export const useAdminDashboard = () => {
  const navigate = useNavigate();
  const { tickets } = useTickets();
  const [isAdmin, setIsAdmin] = useState(false);
  const [filter, setFilter] = useState<"all" | "open" | "inProgress" | "resolved" | "closed">("all");
  const [showResolved, setShowResolved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
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
  
  const filteredTickets = tickets
    .filter(ticket => showResolved || (ticket.status !== "resolved" && ticket.status !== "closed")) // Only show non-resolved/non-closed tickets by default
    .filter(ticket => {
      if (filter === "all") return true;
      return ticket.status === filter;
    });
  
  const countByStatus: TicketStatusCounts = {
    all: tickets.filter(ticket => showResolved || (ticket.status !== "resolved" && ticket.status !== "closed")).length,
    open: tickets.filter(ticket => ticket.status === "open").length,
    inProgress: tickets.filter(ticket => ticket.status === "inProgress").length,
    resolved: tickets.filter(ticket => ticket.status === "resolved").length,
    closed: tickets.filter(ticket => ticket.status === "closed").length,
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
    isLoading
  };
};
