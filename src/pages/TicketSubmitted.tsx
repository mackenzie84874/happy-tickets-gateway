
import React from "react";
import { useSearchParams } from "react-router-dom";
import { useTicketData } from "@/hooks/useTicketData";
import LoadingState from "@/components/ticket/LoadingState";
import ErrorState from "@/components/ticket/ErrorState";
import SuccessHeader from "@/components/ticket/SuccessHeader";
import TicketDetails from "@/components/ticket/TicketDetails";

const TicketSubmitted: React.FC = () => {
  const [searchParams] = useSearchParams();
  const ticketId = searchParams.get("id");
  const { ticket, loading, error, isUpdating, replies, repliesLoading } = useTicketData({ ticketId });

  if (loading) {
    return <LoadingState />;
  }

  if (error || !ticket) {
    return <ErrorState error={error} />;
  }

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center">
      <div className="container px-4 sm:px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <SuccessHeader />
          <TicketDetails 
            ticket={ticket} 
            isUpdating={isUpdating} 
            replies={replies}
            repliesLoading={repliesLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default TicketSubmitted;
