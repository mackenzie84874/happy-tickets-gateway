
import React from "react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { Ticket, TicketReply } from "@/types/ticket";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import TicketStatusBadge from "./TicketStatusBadge";
import TicketStatusMessage from "./TicketStatusMessage";
import TicketReplies from "./TicketReplies";
import StarRating from "./StarRating";

interface TicketDetailsProps {
  ticket: Ticket;
  isUpdating: boolean;
  replies: TicketReply[];
  repliesLoading: boolean;
}

const TicketDetails: React.FC<TicketDetailsProps> = ({ 
  ticket, 
  isUpdating, 
  replies, 
  repliesLoading 
}) => {
  return (
    <Card className={`shadow-sm transition-all duration-300 ${isUpdating ? 'ring-2 ring-primary animate-pulse' : ''}`}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Ticket Details</CardTitle>
            <CardDescription>
              Ticket ID: <span className="font-mono text-xs">{ticket.id}</span>
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            {isUpdating && (
              <div className="flex items-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2 text-primary" />
                <span className="text-xs text-primary">Updating...</span>
              </div>
            )}
            <TicketStatusBadge status={ticket.status} />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
            <p>{ticket.name}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
            <p>{ticket.email}</p>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Subject</h3>
          <p>{ticket.subject}</p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Message</h3>
          <p className="whitespace-pre-wrap">{ticket.message}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
            <div className="mt-1">
              <TicketStatusMessage status={ticket.status} />
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Submitted On</h3>
            <p>
              {ticket.created_at 
                ? format(new Date(ticket.created_at), 'PPpp') 
                : "Just now"}
            </p>
          </div>
        </div>
        
        {ticket.status === "closed" && (
          <div className="p-4 bg-gray-50 rounded-lg border">
            <StarRating ticketId={ticket.id} initialRating={ticket.rating} />
          </div>
        )}
        
        <TicketReplies replies={replies} isLoading={repliesLoading} />
      </CardContent>
      
      <CardFooter className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 sm:justify-end">
        <Link to="/">
          <Button variant="outline">Return to Home</Button>
        </Link>
        
        <Link to="/submit-ticket">
          <Button>Submit Another Ticket</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default TicketDetails;
