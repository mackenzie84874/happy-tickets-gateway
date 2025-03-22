
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTickets } from "@/hooks/useTicketContext";
import { Ticket } from "@/types/ticket";
import TicketCard from "@/components/TicketCard";

const AdminDashboard: React.FC = () => {
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
  
  const countByStatus = {
    all: tickets.length,
    open: tickets.filter(ticket => ticket.status === "open").length,
    inProgress: tickets.filter(ticket => ticket.status === "inProgress").length,
    resolved: tickets.filter(ticket => ticket.status === "resolved").length,
  };
  
  if (!isAdmin) {
    return <div>Checking admin status...</div>;
  }
  
  return (
    <div className="min-h-screen bg-secondary/30 pt-20">
      <div className="container px-4 sm:px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage and respond to support tickets</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center">
            <button
              onClick={handleLogout}
              className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Logout
            </button>
          </div>
        </div>
        
        {/* Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "All Tickets", value: countByStatus.all, status: "all", color: "bg-gray-100 text-gray-700" },
            { label: "Open", value: countByStatus.open, status: "open", color: "bg-blue-100 text-blue-700" },
            { label: "In Progress", value: countByStatus.inProgress, status: "inProgress", color: "bg-yellow-100 text-yellow-700" },
            { label: "Resolved", value: countByStatus.resolved, status: "resolved", color: "bg-green-100 text-green-700" },
          ].map((item) => (
            <div 
              key={item.status} 
              className={`bg-card border rounded-lg p-6 cursor-pointer transition-transform hover:scale-[1.01] ${
                filter === item.status ? "ring-2 ring-primary/40" : ""
              }`}
              onClick={() => setFilter(item.status as any)}
            >
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">{item.label}</span>
                <span className={`text-sm font-medium px-2.5 py-0.5 rounded-full ${item.color}`}>
                  {item.value}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        {/* Tickets List */}
        <div className="bg-card border rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">
              {filter === "all" ? "All Tickets" : 
               filter === "open" ? "Open Tickets" :
               filter === "inProgress" ? "In Progress Tickets" : "Resolved Tickets"}
            </h2>
          </div>
          
          <div className="divide-y">
            {filteredTickets.length > 0 ? (
              filteredTickets.map((ticket: Ticket) => (
                <div key={ticket.id} className="p-4">
                  <TicketCard ticket={ticket} />
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                    <rect x="2" y="6" width="20" height="8" rx="1"></rect>
                    <path d="M6 14v3a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-3"></path>
                    <path d="M4 10h16"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2">No tickets found</h3>
                <p className="text-muted-foreground">
                  There are no tickets matching the current filter.
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Help Link */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Need help using the admin dashboard? Check the <Link to="#" className="text-primary hover:underline">documentation</Link>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
