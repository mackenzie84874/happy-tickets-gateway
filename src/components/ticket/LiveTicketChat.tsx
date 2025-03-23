
import React, { useEffect, useRef } from "react";
import { format } from "date-fns";
import { TicketReply } from "@/types/ticket";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";

interface LiveTicketChatProps {
  replies: TicketReply[];
  isLoading: boolean;
  adminName?: string;
}

const LiveTicketChat: React.FC<LiveTicketChatProps> = ({ 
  replies, 
  isLoading,
  adminName = "Admin"
}) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [replies]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-60">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (replies.length === 0) {
    return (
      <div className="flex justify-center items-center h-60 text-muted-foreground">
        <p>No messages yet. Start the conversation.</p>
      </div>
    );
  }

  return (
    <div className="h-[400px] flex flex-col" ref={scrollAreaRef}>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {replies.map((reply) => {
            const isSystem = reply.admin_name === "System";
            const isGuest = reply.is_from_guest || reply.admin_name.startsWith("Guest (");
            const displayName = isSystem 
              ? "System" 
              : isGuest 
                ? reply.admin_name.replace("Guest (", "").replace(")", "") 
                : reply.admin_name;
            
            return (
              <div 
                key={reply.id}
                className={`flex ${isGuest ? 'justify-start' : 'justify-end'}`}
              >
                <div 
                  className={`max-w-[80%] px-4 py-2 rounded-lg ${
                    isSystem 
                      ? "bg-secondary/30 text-secondary-foreground mx-auto" 
                      : isGuest 
                        ? "bg-blue-50 border border-blue-100 text-blue-800" 
                        : "bg-primary/10 text-primary-foreground"
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-sm">{displayName}</span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(reply.created_at), "p")}
                    </span>
                  </div>
                  <p className="whitespace-pre-wrap break-words">{reply.message}</p>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default LiveTicketChat;
