
import React from "react";
import { Badge } from "@/components/ui/badge";

type TicketStatus = "open" | "inProgress" | "resolved";

interface TicketStatusBadgeProps {
  status: TicketStatus;
}

const TicketStatusBadge: React.FC<TicketStatusBadgeProps> = ({ status }) => {
  switch (status) {
    case "open":
      return <Badge className="bg-blue-500 hover:bg-blue-600">Open</Badge>;
    case "inProgress":
      return <Badge className="bg-yellow-500 hover:bg-yellow-600">In Progress</Badge>;
    case "resolved":
      return <Badge className="bg-green-500 hover:bg-green-600">Resolved</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

export default TicketStatusBadge;
