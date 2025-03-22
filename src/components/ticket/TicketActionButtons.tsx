
import React from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, CheckCircle, Lock } from "lucide-react";
import { Ticket } from "@/types/ticket";

interface TicketActionButtonsProps {
  ticket: Ticket;
  onAccept: () => void;
  onReply: () => void;
  onClose: () => void;
}

const TicketActionButtons: React.FC<TicketActionButtonsProps> = ({
  ticket,
  onAccept,
  onReply,
  onClose
}) => {
  // Only show action buttons if ticket is not resolved or closed
  if (ticket.status === "resolved" || ticket.status === "closed") {
    return null;
  }

  return (
    <div className="flex items-center space-x-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onAccept}
        disabled={ticket.status === "inProgress"}
        className={ticket.status === "inProgress" ? "bg-yellow-50" : ""}
        data-status={ticket.status}
      >
        <CheckCircle className="mr-1 h-4 w-4" />
        {ticket.status === "inProgress" ? "Accepted" : "Accept"}
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onReply}
      >
        <MessageCircle className="mr-1 h-4 w-4" />
        Reply
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onClose}
        className="border-gray-300 text-gray-700 hover:bg-gray-100"
      >
        <Lock className="mr-1 h-4 w-4" />
        Close
      </Button>
    </div>
  );
};

export default TicketActionButtons;
