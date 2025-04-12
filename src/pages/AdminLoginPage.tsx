
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { LogIn, Mail, Lock, ShieldAlert } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

const adminLoginFormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

type AdminLoginFormValues = z.infer<typeof adminLoginFormSchema>;

const AdminLoginPage = () => {
  const { signInWithPassword, user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  
  useEffect(() => {
    // If already logged in and is an admin, redirect to admin dashboard
    if (user && isAdmin()) {
      navigate('/admin-events');
    }
  }, [user, isAdmin, navigate]);
  
  const form = useForm<AdminLoginFormValues>({
    resolver: zodResolver(adminLoginFormSchema),
    defaultValues: {
      email: 'amriteshyadav@admin.com', // Pre-fill the admin email
      password: '',
    },
  });
  
  const handleAdminLoginSubmit = async (values: AdminLoginFormValues) => {
    setIsLoading(true);
    setLoginError(null);
    
    try {
      await signInWithPassword(values.email, values.password);
      
      // Add a small delay to allow the auth state to update
      setTimeout(() => {
        // Check if user is now logged in
        if (user) {
          // Check if the logged-in user is an admin
          if (isAdmin()) {
            toast({
              title: "Admin login successful",
              description: "Redirecting to admin dashboard.",
            });
            navigate('/admin-events');
          } else {
            setLoginError("Access denied. Your account does not have admin privileges.");
            toast({
              title: "Access denied",
              description: "Your account does not have admin privileges.",
              variant: "destructive",
            });
          }
        }
      }, 1000);
    } catch (error: any) {
      // Error is already handled in signInWithPassword
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-muted py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-center items-center mb-10">
        <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
          <ShieldAlert className="h-6 w-6" />
          Admin Login
        </h1>
        <p className="text-muted-foreground mt-2">
          Access the Campus Connect admin dashboard
        </p>
      </div>
      
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Admin Authentication</CardTitle>
          <CardDescription className="text-center">
            Use email: amriteshyadav@admin.com
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {loginError && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>
                {loginError}
              </AlertDescription>
            </Alert>
          )}
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAdminLoginSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="amriteshyadav@admin.com" 
                          className="pl-10"
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          type="password" 
                          placeholder="amritesh" 
                          className="pl-10"
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full mt-6"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In as Admin"}
                {!isLoading && <LogIn className="ml-2 h-4 w-4" />}
              </Button>
            </form>
          </Form>
        </CardContent>
        
        <CardFooter className="flex justify-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
          >
            Back to Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminLoginPage;
