
import { useContext } from "react";
import { TicketContext } from "@/contexts/TicketContext";
import { TicketContextType } from "@/types/ticket";

export const useTickets = (): TicketContextType => {
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error("useTickets must be used within a TicketProvider");
  }
  return context;
};
