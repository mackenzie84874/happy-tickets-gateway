
import React from "react";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import DashboardHeader from "@/components/admin/DashboardHeader";
import StatusFilterCards from "@/components/admin/StatusFilterCards";
import TicketsList from "@/components/admin/TicketsList";
import DashboardFooter from "@/components/admin/DashboardFooter";

const AdminDashboard: React.FC = () => {
  const {
    isAdmin,
    filter,
    setFilter,
    filteredTickets,
    countByStatus,
    handleLogout
  } = useAdminDashboard();
  
  if (!isAdmin) {
    return <div>Checking admin status...</div>;
  }
  
  return (
    <div className="min-h-screen bg-secondary/30 pt-20">
      <div className="container px-4 sm:px-6 py-8">
        <DashboardHeader handleLogout={handleLogout} />
        <StatusFilterCards 
          countByStatus={countByStatus} 
          currentFilter={filter}
          onFilterChange={setFilter}
        />
        <TicketsList 
          tickets={filteredTickets} 
          filterType={filter}
        />
        <DashboardFooter />
      </div>
    </div>
  );
};

export default AdminDashboard;
