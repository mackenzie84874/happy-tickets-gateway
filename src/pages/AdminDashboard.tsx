
import React from "react";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import DashboardHeader from "@/components/admin/DashboardHeader";
import StatusFilterCards from "@/components/admin/StatusFilterCards";
import TicketsList from "@/components/admin/TicketsList";
import DashboardFooter from "@/components/admin/DashboardFooter";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const AdminDashboard: React.FC = () => {
  const {
    isAdmin,
    filter,
    setFilter,
    showResolved,
    setShowResolved,
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
        
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Help Desk Dashboard</h1>
          <div className="flex items-center space-x-2">
            <Switch
              id="show-resolved"
              checked={showResolved}
              onCheckedChange={setShowResolved}
            />
            <Label htmlFor="show-resolved">Show Resolved Tickets</Label>
          </div>
        </div>
        
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
