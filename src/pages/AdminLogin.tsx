
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // For this demo, we use a simple admin credential check
  // In a real app, you would use a proper authentication system
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Simple validation
    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }
    
    setIsLoading(true);
    
    // Fake API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Simple hardcoded admin check for demo
    if (username === "admin" && password === "admin123") {
      // Set admin session
      localStorage.setItem("isAdmin", "true");
      navigate("/admin/dashboard");
    } else {
      setError("Invalid credentials. Try 'admin' and 'admin123'.");
    }
    
    setIsLoading(false);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-20 flex items-center justify-center">
      <div className="container px-4 sm:px-6 py-12">
        <div className="max-w-md mx-auto animate-fade-in">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground flex items-center mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            Back to Home
          </Link>
          
          <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
            <div className="p-8">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold">Admin Login</h1>
                <p className="text-muted-foreground mt-2">
                  Log in to access the ticket management dashboard
                </p>
              </div>
              
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="username" className="text-sm font-medium">
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:border-input"
                    placeholder="Enter your username"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="text-sm font-medium">
                      Password
                    </label>
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:border-input"
                    placeholder="Enter your password"
                  />
                </div>
                
                {error && (
                  <div className="text-destructive text-sm font-medium animate-slide-up">
                    {error}
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-8 rounded-lg bg-primary text-primary-foreground text-sm font-medium transition-all hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
                >
                  {isLoading ? "Logging in..." : "Log In"}
                </button>
              </form>
              
              <div className="mt-6 text-center text-sm text-muted-foreground">
                <p>For demo: Use "admin" and "admin123"</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
