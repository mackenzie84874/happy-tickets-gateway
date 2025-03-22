
import React, { useEffect, useState, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useTickets, Ticket } from "@/contexts/TicketContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

const TicketSubmitted: React.FC = () => {
  const [searchParams] = useSearchParams();
  const ticketId = searchParams.get("id");
  const { getTicketById, subscribeToTicket } = useTickets();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Callback for real-time updates
  const handleTicketUpdate = useCallback((updatedTicket: Ticket) => {
    console.log('Handling ticket update:', updatedTicket);
    setTicket(updatedTicket);
    setIsUpdating(true);
    
    // Visual feedback for the update
    setTimeout(() => {
      setIsUpdating(false);
    }, 2000);
  }, []);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        if (!ticketId) {
          setError("No ticket ID provided");
          setLoading(false);
          return;
        }

        const fetchedTicket = await getTicketById(ticketId);
        if (fetchedTicket) {
          setTicket(fetchedTicket);
        } else {
          setError("Ticket not found");
        }
      } catch (err) {
        console.error("Error fetching ticket details:", err);
        setError("Error loading ticket details");
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [ticketId, getTicketById]);

  // Set up real-time subscription when ticket is loaded
  useEffect(() => {
    if (ticketId && !loading) {
      // Subscribe to real-time updates
      const unsubscribe = subscribeToTicket(ticketId, handleTicketUpdate);
      
      // Clean up subscription on unmount
      return unsubscribe;
    }
  }, [ticketId, loading, subscribeToTicket, handleTicketUpdate]);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-pulse text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading ticket details...</p>
        </div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="container px-4 sm:px-6 py-12">
          <Alert variant="destructive" className="max-w-md mx-auto">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error || "Unable to load ticket details"}. Please try submitting your ticket again.
            </AlertDescription>
          </Alert>
          <div className="max-w-md mx-auto mt-6 text-center">
            <Link to="/submit-ticket">
              <Button>Return to Submit Ticket</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Function to get status badge color
  const getStatusBadge = () => {
    switch (ticket.status) {
      case "open":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Open</Badge>;
      case "inProgress":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">In Progress</Badge>;
      case "resolved":
        return <Badge className="bg-green-500 hover:bg-green-600">Resolved</Badge>;
      default:
        return <Badge>{ticket.status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center">
      <div className="container px-4 sm:px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            
            <h1 className="text-2xl font-bold mb-3">Ticket Submitted Successfully</h1>
            <p className="text-muted-foreground">
              Thank you for submitting your ticket. We've received your request and will respond as soon as possible.
            </p>
          </div>
          
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
                  {getStatusBadge()}
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
                    <p className="text-sm">
                      {ticket.status === "open" && "Your ticket is being reviewed."}
                      {ticket.status === "inProgress" && "We're currently working on your request."}
                      {ticket.status === "resolved" && "Your ticket has been resolved."}
                    </p>
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
        </div>
      </div>
    </div>
  );
};

export default TicketSubmitted;
