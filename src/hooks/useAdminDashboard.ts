
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTickets } from "@/hooks/useTicketContext";
import { Ticket, TicketStatusCounts } from "@/types/ticket";

export const useAdminDashboard = () => {
  const navigate = useNavigate();
  const { tickets } = useTickets();
  const [isAdmin, setIsAdmin] = useState(false);
  const [filter, setFilter] = useState<"all" | "open" | "inProgress" | "resolved">("all");
  
  useEffect(() => {
    // Check if user is logged in as admin
    const adminStatus = localStorage.getItem("isAdmin");
    if (adminStatus !== "true") {
      navigate("/admin");
    } else {
      setIsAdmin(true);
    }
  }, [navigate]);
  
  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    navigate("/admin");
  };
  
  const filteredTickets = tickets.filter(ticket => {
    if (filter === "all") return true;
    return ticket.status === filter;
  });
  
  const countByStatus: TicketStatusCounts = {
    all: tickets.length,
    open: tickets.filter(ticket => ticket.status === "open").length,
    inProgress: tickets.filter(ticket => ticket.status === "inProgress").length,
    resolved: tickets.filter(ticket => ticket.status === "resolved").length,
  };

  return {
    isAdmin,
    filter,
    setFilter,
    filteredTickets,
    countByStatus,
    handleLogout
  };
};
