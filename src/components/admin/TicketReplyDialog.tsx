
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useTickets } from "@/hooks/useTicketContext";
import { Ticket } from "@/types/ticket";
import { useToast } from "@/hooks/use-toast";

interface TicketReplyDialogProps {
  ticket: Ticket;
  isOpen: boolean;
  onClose: () => void;
}

const TicketReplyDialog: React.FC<TicketReplyDialogProps> = ({ ticket, isOpen, onClose }) => {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { addReply } = useTickets();
  const { toast } = useToast();

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
      onClose();
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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reply to ticket</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="text-sm font-medium mb-1">Ticket: {ticket.subject}</div>
            <div className="text-sm text-muted-foreground mb-4">From: {ticket.name}</div>
            
            <Textarea
              placeholder="Type your reply here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[120px]"
              disabled={isSubmitting}
            />
            
            {submitError && (
              <div className="mt-2 p-2 text-sm text-red-600 bg-red-50 rounded border border-red-200">
                Error: {submitError}
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Reply"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TicketReplyDialog;
