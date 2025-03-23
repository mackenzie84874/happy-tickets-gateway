
import React, { useState } from "react";
import { Ticket } from "@/types/ticket";
import TicketCard from "@/components/TicketCard";
import TicketSkeleton from "./TicketSkeleton";
import { AlertCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useTickets } from "@/hooks/useTicketContext";
import { useToast } from "@/hooks/use-toast";

interface TicketsListProps {
  tickets: Ticket[];
  filterType: "all" | "open" | "inProgress" | "resolved" | "closed";
  isLoading?: boolean;
}

const TicketsList: React.FC<TicketsListProps> = ({ 
  tickets, 
  filterType,
  isLoading = false
}) => {
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteTickets } = useTickets();
  const { toast } = useToast();

  const getFilterTitle = () => {
    switch (filterType) {
      case "all": return "All Tickets";
      case "open": return "Open Tickets";
      case "inProgress": return "In Progress Tickets";
      case "resolved": return "Resolved Tickets";
      case "closed": return "Closed Tickets";
    }
  };

  const handleToggleSelect = (ticketId: string) => {
    setSelectedTickets(prev => 
      prev.includes(ticketId) 
        ? prev.filter(id => id !== ticketId)
        : [...prev, ticketId]
    );
  };

  const handleSelectAll = () => {
    if (selectedTickets.length === tickets.length) {
      setSelectedTickets([]);
    } else {
      setSelectedTickets(tickets.map(ticket => ticket.id));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedTickets.length === 0) return;
    
    setIsDeleting(true);
    try {
      await deleteTickets(selectedTickets);
      toast({
        title: "Tickets deleted",
        description: `${selectedTickets.length} ticket(s) have been deleted.`,
      });
      setSelectedTickets([]);
    } catch (error) {
      console.error("Error deleting tickets:", error);
      toast({
        title: "Error deleting tickets",
        description: "Failed to delete selected tickets. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <div className="bg-card border rounded-lg shadow-sm overflow-hidden">
      <div className="p-6 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold">{getFilterTitle()}</h2>
        
        {tickets.length > 0 && (
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleSelectAll}
            >
              {selectedTickets.length === tickets.length ? "Deselect All" : "Select All"}
            </Button>
            
            {selectedTickets.length > 0 && (
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => setShowDeleteDialog(true)}
                className="flex items-center gap-1"
              >
                <Trash2 className="h-4 w-4" />
                Delete Selected ({selectedTickets.length})
              </Button>
            )}
          </div>
        )}
      </div>
      
      <div className="divide-y">
        {isLoading ? (
          // Show skeleton loading state when loading
          Array.from({ length: 3 }).map((_, index) => (
            <div key={`skeleton-${index}`} className="p-4">
              <TicketSkeleton />
            </div>
          ))
        ) : tickets.length > 0 ? (
          tickets.map((ticket: Ticket) => (
            <div key={ticket.id} className="p-4">
              <TicketCard 
                ticket={ticket} 
                isSelected={selectedTickets.includes(ticket.id)}
                onToggleSelect={handleToggleSelect}
              />
            </div>
          ))
        ) : (
          <div className="p-8 text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <AlertCircle className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No tickets found</h3>
            <p className="text-muted-foreground">
              There are no tickets matching the current filter. Try changing the filter or toggle the "Show Resolved Tickets" option.
            </p>
          </div>
        )}
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Selected Tickets</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedTickets.length} selected ticket(s)? 
              This action cannot be undone and all associated data will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteSelected}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TicketsList;
