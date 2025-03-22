
import React from "react";
import { cn } from "@/lib/utils";

type TicketStatus = "open" | "inProgress" | "resolved" | "closed";

interface TicketStatusBadgeProps {
  status: TicketStatus;
}

const TicketStatusBadge: React.FC<TicketStatusBadgeProps> = ({ status }) => {
  const statusColors = {
    open: "bg-blue-50 text-blue-700 border-blue-200",
    inProgress: "bg-yellow-50 text-yellow-700 border-yellow-200",
    resolved: "bg-green-50 text-green-700 border-green-200",
    closed: "bg-gray-50 text-gray-700 border-gray-200"
  };
  
  return (
    <span 
      className={cn(
        "px-2.5 py-0.5 rounded-full text-xs font-medium border",
        statusColors[status]
      )}
    >
      {status === "inProgress" ? "In Progress" : status}
    </span>
  );
};

export default TicketStatusBadge;
