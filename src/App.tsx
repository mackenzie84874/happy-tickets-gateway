
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster"
import Index from "@/pages/Index";
import SubmitTicket from "@/pages/SubmitTicket";
import TicketSubmitted from "@/pages/TicketSubmitted";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import NotFound from "@/pages/NotFound";
import { TicketProvider } from "@/contexts/TicketContext";
import AnimatedTransition from "@/components/AnimatedTransition";
import MyTickets from "@/pages/MyTickets";

function App() {
  return (
    <>
      <BrowserRouter>
        <TicketProvider>
          <Toaster />
          <AnimatedTransition>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/submit-ticket" element={<SubmitTicket />} />
              <Route path="/ticket-submitted" element={<TicketSubmitted />} />
              <Route path="/my-tickets" element={<MyTickets />} />
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatedTransition>
        </TicketProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
