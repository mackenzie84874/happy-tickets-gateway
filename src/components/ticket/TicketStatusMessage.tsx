
import React from "react";

type TicketStatus = "open" | "inProgress" | "resolved" | "closed";

interface TicketStatusMessageProps {
  status: TicketStatus;
}

const TicketStatusMessage: React.FC<TicketStatusMessageProps> = ({ status }) => {
  switch (status) {
    case "open":
      return <p className="text-sm">Your ticket is being reviewed.</p>;
    case "inProgress":
      return <p className="text-sm">We're currently working on your request.</p>;
    case "resolved":
      return <p className="text-sm">Your ticket has been resolved.</p>;
    case "closed":
      return <p className="text-sm">Your ticket has been closed. Thank you for using our support!</p>;
    default:
      return <p className="text-sm">Status: {status}</p>;
  }
};

export default TicketStatusMessage;
