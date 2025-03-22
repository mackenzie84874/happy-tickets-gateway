
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Index from "./pages/Index";
import SubmitTicket from "./pages/SubmitTicket";
import TicketSubmitted from "./pages/TicketSubmitted";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

// Components and Context
import Navbar from "./components/Navbar";
import AnimatedTransition from "./components/AnimatedTransition";
import { TicketProvider } from "./contexts/TicketContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <TicketProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={
              <AnimatedTransition>
                <Index />
              </AnimatedTransition>
            } />
            <Route path="/submit-ticket" element={
              <AnimatedTransition>
                <SubmitTicket />
              </AnimatedTransition>
            } />
            <Route path="/ticket-submitted" element={
              <AnimatedTransition>
                <TicketSubmitted />
              </AnimatedTransition>
            } />
            <Route path="/admin" element={
              <AnimatedTransition>
                <AdminLogin />
              </AnimatedTransition>
            } />
            <Route path="/admin/dashboard" element={
              <AnimatedTransition>
                <AdminDashboard />
              </AnimatedTransition>
            } />
            <Route path="*" element={
              <AnimatedTransition>
                <NotFound />
              </AnimatedTransition>
            } />
          </Routes>
        </BrowserRouter>
      </TicketProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
