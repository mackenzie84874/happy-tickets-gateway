
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useTickets } from "@/hooks/useTicketContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface GuestReplyFormProps {
  ticketId: string;
  guestName: string;
}

const GuestReplyForm: React.FC<GuestReplyFormProps> = ({ ticketId, guestName }) => {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addReply, getTicketById } = useTickets();
  const { toast } = useToast();
  const [ticketStatus, setTicketStatus] = useState<string | null>(null);

  // Check ticket status on mount to ensure we don't allow replies to resolved/closed tickets
  useEffect(() => {
    const checkTicketStatus = async () => {
      try {
        const ticket = await getTicketById(ticketId);
        if (ticket) {
          setTicketStatus(ticket.status);
        }
      } catch (error) {
        console.error("Error checking ticket status:", error);
      }
    };
    
    checkTicketStatus();
  }, [ticketId, getTicketById]);

  // If ticket is resolved or closed, don't allow replies
  if (ticketStatus === "resolved" || ticketStatus === "closed") {
    return (
      <Alert className="mt-6 border-t pt-4 bg-yellow-50 text-yellow-800 border-yellow-200">
        <AlertCircle className="h-4 w-4 text-yellow-600" />
        <AlertDescription>
          This ticket is {ticketStatus}. You cannot add more replies.
        </AlertDescription>
      </Alert>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      toast({
        title: "Empty message",
        description: "Please enter a message before sending.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Recheck ticket status before submitting to prevent submitting to closed tickets
      const ticket = await getTicketById(ticketId);
      if (ticket && (ticket.status === "resolved" || ticket.status === "closed")) {
        toast({
          title: "Cannot reply",
          description: `This ticket is ${ticket.status}. You cannot add more replies.`,
          variant: "destructive"
        });
        return;
      }
      
      await addReply(ticketId, guestName, message, true);
      setMessage("");
      toast({
        title: "Reply sent",
        description: "Your reply has been sent successfully.",
      });
    } catch (error) {
      console.error("Failed to send reply:", error);
      // Error toast is already shown in the addReply function
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4 border-t pt-4">
      <h3 className="text-base font-medium">Reply to support</h3>
      <Textarea
        placeholder="Type your reply here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="min-h-[100px] resize-y"
        disabled={isSubmitting}
      />
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Send Reply"
          )}
        </Button>
      </div>
    </form>
  );
};

export default GuestReplyForm;
