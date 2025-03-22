
import React from "react";
import { TicketStatusCounts } from "@/types/ticket";
import { AlignLeft, Clock, CheckCircle, Lock } from "lucide-react";

interface StatusFilterCardsProps {
  countByStatus: TicketStatusCounts;
  currentFilter: string;
  onFilterChange: (filter: "all" | "open" | "inProgress" | "resolved" | "closed") => void;
}

const StatusFilterCards: React.FC<StatusFilterCardsProps> = ({
  countByStatus,
  currentFilter,
  onFilterChange
}) => {
  const filters = [
    {
      id: "all",
      label: "All Tickets",
      count: countByStatus.all,
      icon: AlignLeft,
      color: "bg-gray-100 text-gray-600"
    },
    {
      id: "open",
      label: "Open",
      count: countByStatus.open,
      icon: AlignLeft,
      color: "bg-blue-100 text-blue-600"
    },
    {
      id: "inProgress",
      label: "In Progress",
      count: countByStatus.inProgress,
      icon: Clock,
      color: "bg-yellow-100 text-yellow-600"
    },
    {
      id: "resolved",
      label: "Resolved",
      count: countByStatus.resolved,
      icon: CheckCircle,
      color: "bg-green-100 text-green-600"
    },
    {
      id: "closed",
      label: "Closed",
      count: countByStatus.closed,
      icon: Lock,
      color: "bg-gray-100 text-gray-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
      {filters.map((filter) => {
        const Icon = filter.icon;
        return (
          <div
            key={filter.id}
            className={`cursor-pointer rounded-lg border p-4 transition-colors hover:border-gray-300 hover:bg-gray-50 ${
              currentFilter === filter.id ? "border-primary bg-primary/5" : "border-gray-200"
            }`}
            onClick={() => onFilterChange(filter.id as "all" | "open" | "inProgress" | "resolved" | "closed")}
          >
            <div className="flex justify-between items-center mb-2">
              <div className={`p-2 rounded-full ${filter.color}`}>
                <Icon className="h-4 w-4" />
              </div>
              <span className="text-2xl font-semibold">{filter.count}</span>
            </div>
            <h3 className="font-medium text-sm">{filter.label}</h3>
          </div>
        );
      })}
    </div>
  );
};

export default StatusFilterCards;
