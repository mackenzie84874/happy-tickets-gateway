
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useTickets } from "@/hooks/useTicketContext";
import { Ticket, TicketReply } from "@/types/ticket";
import { useToast } from "@/hooks/use-toast";
import { SendHorizonal } from "lucide-react";
import LiveTicketChat from "@/components/ticket/LiveTicketChat";
import { fetchReplies } from "@/utils/tickets/ticketReplies";
import { subscribeToReplies } from "@/utils/tickets/realtimeSubscriptions";

interface TicketReplyDialogProps {
  ticket: Ticket;
  isOpen: boolean;
  onClose: (replies?: TicketReply[]) => void;
}

const TicketReplyDialog: React.FC<TicketReplyDialogProps> = ({ ticket, isOpen, onClose }) => {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [replies, setReplies] = useState<TicketReply[]>([]);
  const [isLoadingReplies, setIsLoadingReplies] = useState(true);
  const { addReply } = useTickets();
  const { toast } = useToast();

  // Fetch replies when dialog is opened
  useEffect(() => {
    if (isOpen) {
      const loadReplies = async () => {
        setIsLoadingReplies(true);
        try {
          const fetchedReplies = await fetchReplies(ticket.id);
          setReplies(fetchedReplies);
        } catch (error) {
          console.error("Failed to load replies:", error);
        } finally {
          setIsLoadingReplies(false);
        }
      };
      
      loadReplies();
    }
  }, [isOpen, ticket.id]);

  // Subscribe to real-time updates for new replies
  useEffect(() => {
    if (isOpen) {
      const unsubscribe = subscribeToReplies(ticket.id, (newReply) => {
        setReplies((prev) => {
          // Check if the reply already exists
          const exists = prev.some((r) => r.id === newReply.id);
          if (exists) return prev;
          return [...prev, newReply];
        });
      });
      
      return () => {
        unsubscribe();
      };
    }
  }, [isOpen, ticket.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!message.trim()) {
      toast({
        title: "Empty message",
        description: "Please enter a reply message",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      console.log("Attempting to send reply for ticket:", ticket.id);
      // Use "Admin" as the default admin name for now
      await addReply(ticket.id, "Admin", message);
      
      console.log("Reply sent successfully");
      toast({
        title: "Reply sent",
        description: "Your reply has been sent to the customer",
      });
      
      setMessage("");
    } catch (error: any) {
      console.error("Error sending reply:", error);
      setSubmitError(error?.message || "Unknown error");
      toast({
        title: "Failed to send reply",
        description: "There was a problem sending your reply. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDialogClose = () => {
    // Pass the current replies back to the parent component
    onClose(replies);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleDialogClose()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Chat with {ticket.name}</span>
            <span className="text-sm font-normal text-muted-foreground">Ticket: {ticket.subject}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 my-4 border rounded-md overflow-hidden">
          <LiveTicketChat 
            replies={replies} 
            isLoading={isLoadingReplies}
            adminName="Admin"
          />
        </div>
        
        <form onSubmit={handleSubmit} className="mt-auto">
          <div className="flex items-end gap-2">
            <Textarea
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 min-h-[80px] max-h-[120px] resize-none"
              disabled={isSubmitting}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (message.trim()) {
                    handleSubmit(e);
                  }
                }
              }}
            />
            
            <Button 
              type="submit"
              size="icon"
              className="mb-1"
              disabled={isSubmitting}
            >
              <SendHorizonal className={isSubmitting ? "animate-pulse" : ""} />
            </Button>
          </div>
          
          {submitError && (
            <div className="mt-2 p-2 text-sm text-red-600 bg-red-50 rounded border border-red-200">
              Error: {submitError}
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TicketReplyDialog;
