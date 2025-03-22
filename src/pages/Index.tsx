
import React from "react";
import { Link } from "react-router-dom";

const Index: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white"></div>
        </div>
        
        <div className="container px-4 sm:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block px-3 py-1 mb-6 rounded-full bg-primary/10 text-primary backdrop-blur-sm animate-fade-in">
              <span className="text-sm font-medium">Simple & Intuitive</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 animate-slide-up">
              Modern Ticket System for<br />Seamless Support
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-10 animate-slide-up" style={{ animationDelay: "100ms" }}>
              An elegantly designed platform that prioritizes simplicity and user experience. 
              Submit and track tickets with ease.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 animate-slide-up" style={{ animationDelay: "200ms" }}>
              <Link
                to="/submit-ticket"
                className="px-8 py-3 rounded-lg bg-primary text-primary-foreground font-medium transition-colors hover:opacity-90"
              >
                Submit a Ticket
              </Link>
              
              <Link
                to="#features"
                className="px-8 py-3 rounded-lg bg-secondary text-secondary-foreground font-medium transition-colors hover:bg-secondary/80"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-0 right-0 flex justify-center">
          <a href="#features" className="p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md animate-bounce">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </a>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="container px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Designed with Simplicity in Mind</h2>
            <p className="text-lg text-muted-foreground">
              Experience a ticket system that embodies the principles of clean, functional design.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Intuitive Submission",
                description: "A clean, simplified ticket form that gathers just the information needed to assist you efficiently.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
                    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
                    <path d="M2 2l7.586 7.586"></path>
                    <circle cx="11" cy="11" r="2"></circle>
                  </svg>
                )
              },
              {
                title: "Real-time Updates",
                description: "Track the status of your tickets in real-time as they move from open to resolved.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                  </svg>
                )
              },
              {
                title: "Admin Dashboard",
                description: "A beautiful, functional dashboard for administrators to manage and respond to tickets.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="3" y1="9" x2="21" y2="9"></line>
                    <line x1="9" y1="21" x2="9" y2="9"></line>
                  </svg>
                )
              }
            ].map((feature, index) => (
              <div key={index} className="bg-card p-8 rounded-lg border border-border transition-all duration-300 hover:shadow-md">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-medium mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-b from-white to-blue-50">
        <div className="container px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-lg text-muted-foreground mb-10">
              Submit your first ticket and experience a seamless support process.
            </p>
            
            <Link
              to="/submit-ticket"
              className="px-8 py-3 rounded-lg bg-primary text-primary-foreground font-medium transition-colors hover:opacity-90"
            >
              Submit a Ticket
            </Link>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 bg-secondary">
        <div className="container px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="text-lg font-semibold">TicketSystem</div>
              <p className="text-sm text-muted-foreground mt-1">Seamless support platform</p>
            </div>
            
            <div className="flex space-x-8 items-center">
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
              <Link to="/submit-ticket" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Submit Ticket
              </Link>
              <Link to="/admin" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Admin
              </Link>
            </div>
          </div>
          
          <div className="border-t border-border/40 mt-8 pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} TicketSystem. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
