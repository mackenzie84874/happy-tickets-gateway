
import React from "react";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import DashboardHeader from "@/components/admin/DashboardHeader";
import StatusFilterCards from "@/components/admin/StatusFilterCards";
import TicketsList from "@/components/admin/TicketsList";
import DashboardFooter from "@/components/admin/DashboardFooter";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ClipboardList } from "lucide-react";

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
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary/30">
        <div className="text-center animate-pulse">
          <ClipboardList className="h-12 w-12 text-primary/50 mx-auto mb-4" />
          <p className="text-lg font-medium">Checking admin status...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white pt-20">
      <div className="container px-4 sm:px-6 py-8">
        <DashboardHeader handleLogout={handleLogout} />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ClipboardList className="h-6 w-6 text-primary" />
            Help Desk Dashboard
          </h1>
          <div className="flex items-center space-x-3 bg-white p-2 rounded-lg border shadow-sm">
            <Switch
              id="show-resolved"
              checked={showResolved}
              onCheckedChange={setShowResolved}
            />
            <Label htmlFor="show-resolved" className="cursor-pointer">
              Show Resolved Tickets
            </Label>
          </div>
        </div>
        
        <StatusFilterCards 
          countByStatus={countByStatus} 
          currentFilter={filter}
          onFilterChange={setFilter}
        />
        
        <div className="mt-6 bg-white rounded-lg border shadow-sm overflow-hidden">
          <TicketsList 
            tickets={filteredTickets} 
            filterType={filter}
          />
        </div>
        
        <DashboardFooter />
      </div>
    </div>
  );
};

export default AdminDashboard;
