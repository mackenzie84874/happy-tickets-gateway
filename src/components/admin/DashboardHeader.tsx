
import React from "react";
import { useNavigate } from "react-router-dom";

interface DashboardHeaderProps {
  handleLogout: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ handleLogout }) => {
  return (
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
  );
};

export default DashboardHeader;
