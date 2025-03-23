
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [adminCheckError, setAdminCheckError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setAdminCheckError("");
    
    // Simple validation
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Normalize email to lowercase
      let normalizedEmail = email.trim().toLowerCase();
      
      // First check if email exists in admin_credentials table
      console.log("Checking if email exists in admin_credentials:", normalizedEmail);
      const { data: adminData, error: adminError } = await supabase
        .from('admin_credentials')
        .select('email')
        .eq('email', normalizedEmail)
        .single();
      
      if (adminError) {
        console.error("Admin check error:", adminError);
        
        // If not found, check with case-insensitive search
        if (adminError.code === 'PGRST116') {
          const { data: adminDataCI, error: adminErrorCI } = await supabase
            .from('admin_credentials')
            .select('email')
            .ilike('email', normalizedEmail);
            
          if (adminErrorCI || !adminDataCI || adminDataCI.length === 0) {
            setAdminCheckError("This email is not registered as an admin");
            throw new Error("Not authorized as admin: Email not registered");
          } else {
            console.log("Found admin with case-insensitive search:", adminDataCI[0].email);
            // Use the email with the correct casing from the database
            normalizedEmail = adminDataCI[0].email;
          }
        } else {
          setAdminCheckError(`Admin check error: ${adminError.message}`);
          throw new Error(`Admin database error: ${adminError.message}`);
        }
      }
      
      console.log("Admin check passed, proceeding with authentication");
      
      // Try to sign in with the admin credentials
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password
      });
      
      if (loginError) {
        console.error("Login error details:", loginError);
        
        // Check if it's a "User doesn't exist" error, we should create the account
        if (loginError.message.includes("Email not confirmed") || 
            loginError.message.includes("Invalid login credentials") ||
            loginError.message.includes("Invalid email or password")) {
          
          console.log("User doesn't exist yet. Creating account...");
          // First-time login: create user account
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: normalizedEmail,
            password
          });
          
          if (signUpError) {
            console.error("Sign up error:", signUpError);
            throw new Error(`Failed to create account: ${signUpError.message}`);
          }
          
          console.log("Account created successfully:", signUpData);
          
          // Now try to sign in with the newly created credentials
          const { data: newSignInData, error: newSignInError } = await supabase.auth.signInWithPassword({
            email: normalizedEmail,
            password
          });
          
          if (newSignInError) {
            console.error("New sign in error:", newSignInError);
            throw new Error(`Failed to log in with new account: ${newSignInError.message}`);
          }
          
          if (newSignInData?.session) {
            // Set admin session
            localStorage.setItem("isAdmin", "true");
            
            toast({
              title: "Account created and login successful",
              description: "Welcome to the admin dashboard",
            });
            
            navigate("/admin/dashboard");
            return;
          }
        } else {
          throw loginError;
        }
      }
      
      if (data?.session) {
        // Set admin session
        localStorage.setItem("isAdmin", "true");
        
        toast({
          title: "Login successful",
          description: "Welcome to the admin dashboard",
        });
        
        navigate("/admin/dashboard");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      if (!adminCheckError) {
        setError(err.message || "Invalid credentials. Please try again.");
      }
      
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
              
              {adminCheckError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  <AlertDescription>{adminCheckError}</AlertDescription>
                </Alert>
              )}
              
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full"
                    placeholder="Enter your email"
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
                  {isLoading ? "Logging in..." : "Log In"}
                </Button>
              </form>
              
              <div className="mt-6 text-center text-sm text-muted-foreground">
                <p>Admin access is restricted to authorized emails only</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
