
export interface Ticket {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "open" | "inProgress" | "resolved";
  created_at?: string;
}

export interface TicketContextType {
  tickets: Ticket[];
  addTicket: (ticket: Omit<Ticket, "id" | "created_at">) => Promise<string | undefined>;
  updateTicket: (updatedTicket: Ticket) => void;
  getTicketById: (id: string) => Promise<Ticket | undefined>;
  subscribeToTicket: (id: string, callback: (ticket: Ticket) => void) => () => void;
}
