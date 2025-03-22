
import React from "react";
import { TicketStatusCounts } from "@/types/ticket";

interface StatusFilterCardsProps {
  countByStatus: TicketStatusCounts;
  currentFilter: "all" | "open" | "inProgress" | "resolved";
  onFilterChange: (filter: "all" | "open" | "inProgress" | "resolved") => void;
}

const StatusFilterCards: React.FC<StatusFilterCardsProps> = ({
  countByStatus,
  currentFilter,
  onFilterChange,
}) => {
  const statusItems = [
    { label: "All Tickets", value: countByStatus.all, status: "all", color: "bg-gray-100 text-gray-700" },
    { label: "Open", value: countByStatus.open, status: "open", color: "bg-blue-100 text-blue-700" },
    { label: "In Progress", value: countByStatus.inProgress, status: "inProgress", color: "bg-yellow-100 text-yellow-700" },
    { label: "Resolved", value: countByStatus.resolved, status: "resolved", color: "bg-green-100 text-green-700" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statusItems.map((item) => (
        <div 
          key={item.status} 
          className={`bg-card border rounded-lg p-6 cursor-pointer transition-transform hover:scale-[1.01] ${
            currentFilter === item.status ? "ring-2 ring-primary/40" : ""
          }`}
          onClick={() => onFilterChange(item.status as any)}
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
  );
};

export default StatusFilterCards;
