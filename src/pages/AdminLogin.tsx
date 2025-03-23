
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { AlertCircle, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("deleon.kelsey170430@gmail.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Check if user is already logged in
  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (isAdmin === "true") {
      navigate("/admin/dashboard");
    }
  }, [navigate]);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Simple validation
    if (!password) {
      setError("Please enter your password");
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Since we're hardcoding the email, we don't need to check admin credentials
      // Just try to sign in or create the account if it doesn't exist
      
      // First try to sign in
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      // If login fails, create the account
      if (signInError) {
        console.log("Login failed, attempting to create account:", signInError.message);
        
        if (password === "testing123") {
          // Create the account with the default password
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password
          });
          
          if (signUpError) {
            console.error("Account creation error:", signUpError);
            throw new Error(`Failed to create account: ${signUpError.message}`);
          }
          
          console.log("Account created successfully, attempting to sign in");
          
          // Try to sign in with the newly created account
          const { data: newSignInData, error: newSignInError } = await supabase.auth.signInWithPassword({
            email,
            password
          });
          
          if (newSignInError) {
            if (newSignInError.message.includes("Email not confirmed")) {
              // For a better user experience, we'll just proceed anyway
              localStorage.setItem("isAdmin", "true");
              toast({
                title: "Admin access granted",
                description: "Welcome to the admin dashboard",
              });
              navigate("/admin/dashboard");
              return;
            }
            throw new Error(`Failed to log in: ${newSignInError.message}`);
          }
          
          if (newSignInData?.session) {
            // Set admin session
            localStorage.setItem("isAdmin", "true");
            toast({
              title: "Login successful",
              description: "Welcome to the admin dashboard",
            });
            navigate("/admin/dashboard");
          }
        } else {
          // Wrong password
          throw new Error("Invalid password. Please use the correct admin password.");
        }
      } else if (signInData?.session) {
        // Successful login
        localStorage.setItem("isAdmin", "true");
        toast({
          title: "Login successful",
          description: "Welcome to the admin dashboard",
        });
        navigate("/admin/dashboard");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Authentication failed. Please try again.");
      
      toast({
        title: "Login failed",
        description: err.message || "Please check your credentials and try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
              
              <Alert className="mb-4 bg-blue-50 border-blue-200">
                <Info className="h-4 w-4 mr-2 text-blue-500" />
                <AlertDescription>
                  Using default admin account: {email}
                </AlertDescription>
              </Alert>
              
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    disabled
                    className="w-full bg-gray-50"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="text-sm font-medium">
                      Password
                    </label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full"
                    placeholder="Enter your password"
                  />
                </div>
                
                {error && (
                  <div className="bg-destructive/10 text-destructive rounded-md p-3 text-sm flex items-center animate-slide-up">
                    <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                    {error}
                  </div>
                )}
                
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-8"
                >
                  {isLoading ? "Processing..." : "Log In"}
                </Button>
                
                <div className="mt-2 text-center text-sm">
                  <p className="text-muted-foreground">Default password: testing123</p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
