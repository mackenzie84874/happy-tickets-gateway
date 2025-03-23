
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import GuestTicketsList from "@/components/ticket/GuestTicketsList";
import { supabase } from "@/integrations/supabase/client";
import { Ticket } from "@/types/ticket";

const MyTickets: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.trim()) {
      toast({
        title: "Email required",
        description: "Please enter your email address to find your tickets",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    
    try {
      // Fetch tickets for this email
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('email', email.trim().toLowerCase())
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Store tickets in state
      setTickets(data as Ticket[] || []);
      
      if (data && data.length > 0) {
        toast({
          title: "Tickets found",
          description: `Found ${data.length} ticket${data.length === 1 ? '' : 's'} for your email address.`
        });
      } else {
        toast({
          title: "No tickets found",
          description: "We couldn't find any tickets for this email address."
        });
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
      toast({
        title: "Error",
        description: "There was a problem fetching your tickets. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-16 pb-16 flex flex-col items-center">
      <div className="container px-4 py-12 max-w-5xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">My Support Tickets</h1>
          <p className="text-muted-foreground">
            View the status and history of your support requests
          </p>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Find Your Tickets</CardTitle>
            <CardDescription>
              Enter the email address you used when submitting your tickets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Input
                  type="email"
                  placeholder="your-email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="w-full"
                />
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Find Tickets
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        {hasSearched && (
          <div className="animate-fade-in">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <GuestTicketsList tickets={tickets} userEmail={email} />
            )}
          </div>
        )}
        
        <div className="mt-8 flex justify-center">
          <Button variant="outline" onClick={() => navigate("/submit-ticket")}>
            Submit a New Ticket
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MyTickets;
