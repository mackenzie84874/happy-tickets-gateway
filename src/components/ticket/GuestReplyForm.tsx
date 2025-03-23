
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useTickets } from "@/hooks/useTicketContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface GuestReplyFormProps {
  ticketId: string;
  guestName: string;
}

const GuestReplyForm: React.FC<GuestReplyFormProps> = ({ ticketId, guestName }) => {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addReply } = useTickets();
  const { toast } = useToast();

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
