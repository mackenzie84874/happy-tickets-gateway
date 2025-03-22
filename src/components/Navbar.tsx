
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);
  
  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out py-4 px-6 md:px-12",
        scrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-xl font-semibold tracking-tight">TicketSystem</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-8">
          <NavLink to="/" label="Home" isActive={location.pathname === "/"} />
          <NavLink to="/submit-ticket" label="Submit Ticket" isActive={location.pathname === "/submit-ticket"} />
          <NavLink to="/admin" label="Admin" isActive={location.pathname.startsWith("/admin")} />
        </nav>
        
        <div className="md:hidden">
          {/* Mobile menu button - simplified for this version */}
          <Link to="/submit-ticket" className="py-2 px-4 rounded-full bg-primary text-primary-foreground text-sm font-medium transition-colors">
            Submit Ticket
          </Link>
        </div>
      </div>
    </header>
  );
};

interface NavLinkProps {
  to: string;
  label: string;
  isActive: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ to, label, isActive }) => {
  return (
    <Link 
      to={to} 
      className={cn(
        "relative py-1 font-medium transition-colors",
        isActive ? "text-primary" : "text-foreground/80 hover:text-foreground"
      )}
    >
      {label}
      {isActive && (
        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full transform animate-fade-in" />
      )}
    </Link>
  );
};

export default Navbar;
