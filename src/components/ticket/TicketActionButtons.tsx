
import React from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, CheckCircle, Lock, CheckSquare } from "lucide-react";
import { Ticket } from "@/types/ticket";
import { useToast } from "@/hooks/use-toast";

interface TicketActionButtonsProps {
  ticket: Ticket;
  onAccept: () => void;
  onReply: () => void;
  onClose: () => void;
  onResolve: () => void;
}

const TicketActionButtons: React.FC<TicketActionButtonsProps> = ({
  ticket,
  onAccept,
  onReply,
  onClose,
  onResolve
}) => {
  const { toast } = useToast();
  
  const handleClose = () => {
    // Confirm before closing
    if (window.confirm("Are you sure you want to close this ticket? This will prompt the customer to rate their experience.")) {
      onClose();
      
      // Show toast to admin
      toast({
        title: "Ticket closed",
        description: "The customer will be prompted to rate your support.",
      });
    }
  };
  
  const handleResolve = () => {
    if (window.confirm("Are you sure you want to mark this ticket as resolved? The customer will no longer be able to reply.")) {
      onResolve();
      
      toast({
        title: "Ticket resolved",
        description: "The customer has been notified that their ticket is resolved.",
      });
    }
  };
  
  // Only show action buttons if ticket is not resolved or closed
  if (ticket.status === "closed") {
    return null;
  }

  return (
    <div className="flex items-center space-x-2">
      {ticket.status !== "resolved" && (
        <>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onAccept}
            disabled={ticket.status === "inProgress"}
            className={ticket.status === "inProgress" ? "bg-yellow-50" : ""}
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
        </>
      )}
      
      {ticket.status !== "resolved" && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleResolve}
          className="border-green-300 text-green-700 hover:bg-green-100"
        >
          <CheckSquare className="mr-1 h-4 w-4" />
          Resolve
        </Button>
      )}
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleClose}
        className="border-gray-300 text-gray-700 hover:bg-gray-100"
      >
        <Lock className="mr-1 h-4 w-4" />
        Close
      </Button>
    </div>
  );
};

export default TicketActionButtons;
