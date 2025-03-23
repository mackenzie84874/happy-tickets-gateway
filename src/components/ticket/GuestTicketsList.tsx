
import React from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { Ticket } from "@/types/ticket";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TicketStatusBadge from "./TicketStatusBadge";
import { Star } from "lucide-react";

interface GuestTicketsListProps {
  tickets: Ticket[];
  userEmail: string;
}

const GuestTicketsList: React.FC<GuestTicketsListProps> = ({ tickets, userEmail }) => {
  if (tickets.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-8 text-center">
          <div className="text-muted-foreground mb-4">
            No tickets found for <span className="font-medium">{userEmail}</span>
          </div>
          <Link to="/submit-ticket">
            <Button>Submit a New Ticket</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium mb-3">Your Tickets ({tickets.length})</h2>
      
      {tickets.map((ticket) => (
        <Card key={ticket.id} className="overflow-hidden hover:shadow-md transition-shadow">
          <CardHeader className="py-4 px-5 bg-muted/30">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <TicketStatusBadge status={ticket.status} />
                <span className="text-xs text-muted-foreground">
                  {ticket.created_at && formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true })}
                </span>
              </div>
              
              {ticket.status === "closed" && ticket.rating > 0 && (
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  <span className="text-xs font-medium">{ticket.rating}</span>
                </div>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="p-5">
            <Link to={`/ticket-submitted?id=${ticket.id}`} className="block group">
              <h3 className="font-medium text-lg group-hover:text-primary transition-colors mb-1">
                {ticket.subject}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                {ticket.message}
              </p>
            </Link>
            
            <div className="flex justify-end">
              <Link to={`/ticket-submitted?id=${ticket.id}`}>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default GuestTicketsList;
