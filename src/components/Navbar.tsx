
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { Ticket } from "lucide-react";

export default function Navbar() {
  const location = useLocation();
  
  // Don't show navigation on admin pages
  if (location.pathname.startsWith('/admin')) {
    return null;
  }
  
  return (
    <header className="fixed top-0 left-0 w-full bg-background z-50 border-b border-border shadow-sm">
      <div className="container px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="font-medium text-lg flex items-center space-x-2 text-primary">
          <Ticket className="h-5 w-5" />
          <span>Support Desk</span>
        </Link>
        
        <nav className="flex items-center gap-2">
          <Link to="/my-tickets">
            <Button variant="ghost">My Tickets</Button>
          </Link>
          <Link to="/submit-ticket">
            <Button>Submit Ticket</Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
