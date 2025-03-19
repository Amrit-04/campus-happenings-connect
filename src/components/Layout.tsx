
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell, Calendar, Home, LogIn, LogOut, Menu, User, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  const navigationItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Events', path: '/events', icon: Calendar },
  ];

  if (user) {
    if (isAdmin()) {
      navigationItems.push({ name: 'Admin Dashboard', path: '/admin', icon: Users });
    } else {
      navigationItems.push({ name: 'My Registrations', path: '/my-registrations', icon: User });
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-md">
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
            <h1 className="text-xl font-bold cursor-pointer" onClick={() => navigate('/')}>
              CampusConnect
            </h1>
          </div>
          
          <div className="hidden lg:flex items-center space-x-6">
            {navigationItems.map((item) => (
              <Button
                key={item.path}
                variant={isActive(item.path) ? "secondary" : "ghost"}
                onClick={() => navigate(item.path)}
              >
                <item.icon className="mr-2 h-5 w-5" />
                {item.name}
              </Button>
            ))}
          </div>
          
          <div className="flex items-center space-x-2">
            {user ? (
              <div className="flex items-center gap-2">
                <span className="hidden md:inline text-sm font-medium">
                  {user.name} ({user.role})
                </span>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={logout}
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline" 
                size="sm"
                className="text-[rgb(68,45,82)] border-primary-foreground hover:bg-primary-foreground hover:text-primary"
                onClick={() => navigate('/login')}
              >
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Button>
            )}
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-grow container mx-auto px-4 py-6">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-muted py-6">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} CampusConnect. All rights reserved.</p>
          <p className="text-sm mt-2">A platform for college students to stay connected with campus events.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
