
import React from "react";
import { formatDistanceToNow } from "date-fns";
import { TicketReply } from "@/types/ticket";

interface TicketRepliesProps {
  replies: TicketReply[];
  isLoading: boolean;
}

const TicketReplies: React.FC<TicketRepliesProps> = ({ replies, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-3 pt-4">
        <div className="h-4 w-1/4 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-20 bg-gray-100 animate-pulse rounded"></div>
      </div>
    );
  }

  if (replies.length === 0) {
    return (
      <div className="pt-4 border-t">
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Responses</h3>
        <div className="text-center py-6 text-sm text-muted-foreground bg-gray-50 rounded-md">
          No replies yet. Our team will respond soon.
        </div>
      </div>
    );
  }

  return (
    <div className="pt-4 border-t">
      <h3 className="text-sm font-medium text-muted-foreground mb-2">Responses</h3>
      <div className="space-y-4">
        {replies.map((reply) => (
          <div key={reply.id} className="border rounded-md p-4 bg-gray-50">
            <div className="flex justify-between mb-2">
              <div className="font-medium">{reply.admin_name}</div>
              <div className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(reply.created_at), { addSuffix: true })}
              </div>
            </div>
            <div className="text-sm whitespace-pre-wrap">{reply.message}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TicketReplies;
