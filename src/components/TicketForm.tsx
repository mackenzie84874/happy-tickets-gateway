
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTickets } from "@/contexts/TicketContext";

const TicketForm: React.FC = () => {
  const navigate = useNavigate();
  const { addTicket } = useTickets();
  
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Simple validation
    if (!formState.name || !formState.email || !formState.subject || !formState.message) {
      setError("Please fill in all fields");
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formState.email)) {
      setError("Please enter a valid email address");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Add the ticket with a unique ID and timestamp
      const newTicket = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        status: "open" as "open" | "inProgress" | "resolved", // Use type assertion to match the union type
        ...formState,
      };
      
      await addTicket(newTicket);
      
      // Fake API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Clear form and navigate
      setFormState({ name: "", email: "", subject: "", message: "" });
      navigate("/ticket-submitted");
    } catch (err) {
      setError("There was an error submitting your ticket. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-scale-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formState.name}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-input bg-background transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:border-input"
            placeholder="Your name"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formState.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-input bg-background transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:border-input"
            placeholder="Your email address"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="subject" className="text-sm font-medium">
          Subject
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          value={formState.subject}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg border border-input bg-background transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:border-input"
          placeholder="Subject of your ticket"
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-medium">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          value={formState.message}
          onChange={handleChange}
          rows={5}
          className="w-full px-4 py-3 rounded-lg border border-input bg-background transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:border-input resize-none"
          placeholder="Describe your issue in detail..."
        />
      </div>
      
      {error && (
        <div className="text-destructive text-sm font-medium animate-slide-up">
          {error}
        </div>
      )}
      
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 px-8 rounded-lg bg-primary text-primary-foreground text-sm font-medium transition-all hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
      >
        {isSubmitting ? "Submitting..." : "Submit Ticket"}
      </button>
    </form>
  );
};

export default TicketForm;
