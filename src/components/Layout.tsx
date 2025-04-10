
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell, Calendar, Home, LogIn, LogOut, Menu, User, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, profile, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  const navigationItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Events', path: '/events', icon: Calendar },
    { name: 'About', path: '/about', icon: User },
  ];

  if (user) {
    navigationItems.push({ name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard });
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-black text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Sheet>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <nav className="flex flex-col space-y-4 mt-8">
                  {navigationItems.map((item) => (
                    <Button
                      key={item.path}
                      variant={isActive(item.path) ? "secondary" : "ghost"}
                      className="justify-start"
                      onClick={() => navigate(item.path)}
                    >
                      <item.icon className="mr-2 h-5 w-5" />
                      {item.name}
                    </Button>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
            <h1 
              className="text-xl font-bold cursor-pointer bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent" 
              onClick={() => navigate('/')}
            >
              Campus Connect
            </h1>
          </div>
          
          <div className="hidden lg:flex items-center space-x-6">
            {navigationItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                className={cn(
                  "text-white hover:text-white hover:bg-transparent hover:opacity-80", 
                  isActive(item.path) && "font-bold underline underline-offset-4"
                )}
                onClick={() => navigate(item.path)}
              >
                {item.name}
              </Button>
            ))}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="text-white">
              <Bell className="h-5 w-5" />
            </Button>
            
            {user ? (
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="rounded-full bg-indigo-600 text-white h-10 w-10 flex items-center justify-center"
                  onClick={() => navigate('/profile')}
                >
                  <span className="text-sm font-bold">
                    {profile?.full_name ? profile.full_name.substring(0, 2).toUpperCase() : user.email?.substring(0, 2).toUpperCase() || "DU"}
                  </span>
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline" 
                size="sm"
                className="text-white border-white hover:bg-white hover:text-black"
                onClick={() => navigate('/login')}
              >
                Log In
              </Button>
            )}
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
};

export default Layout;
