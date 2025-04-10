
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell, Calendar, ChevronDown, Home, Menu, User, LayoutDashboard, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
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
    { name: 'About', path: '/about', icon: BookOpen },
  ];

  if (user) {
    navigationItems.push({ name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard });
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="purple-gradient text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Sheet>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 bg-white/95 backdrop-blur-md">
                <div className="flex flex-col h-full">
                  <div className="py-4 border-b">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                      Campus Connect
                    </h2>
                  </div>
                  <nav className="flex flex-col space-y-4 mt-8 flex-grow">
                    {navigationItems.map((item) => (
                      <Button
                        key={item.path}
                        variant={isActive(item.path) ? "secondary" : "ghost"}
                        className={cn(
                          "justify-start",
                          isActive(item.path) && "bg-secondary/20 font-medium"
                        )}
                        onClick={() => navigate(item.path)}
                      >
                        <item.icon className="mr-2 h-5 w-5" />
                        {item.name}
                      </Button>
                    ))}
                    
                    {isAdmin && (
                      <Button
                        variant={location.pathname.startsWith('/admin') ? "secondary" : "ghost"}
                        className={cn(
                          "justify-start",
                          location.pathname.startsWith('/admin') && "bg-secondary/20 font-medium"
                        )}
                        onClick={() => navigate('/admin')}
                      >
                        <LayoutDashboard className="mr-2 h-5 w-5" />
                        Admin
                      </Button>
                    )}
                  </nav>
                  
                  {user && (
                    <div className="mt-auto border-t pt-4">
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start text-destructive"
                        onClick={handleLogout}
                      >
                        Log Out
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
            <h1 
              className="text-xl font-bold cursor-pointer text-white" 
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
                  "text-white hover:text-white hover:bg-white/20", 
                  isActive(item.path) && "font-bold border-b-2 border-white rounded-none"
                )}
                onClick={() => navigate(item.path)}
              >
                {item.name}
              </Button>
            ))}
            
            {isAdmin && (
              <Button
                variant="ghost"
                className={cn(
                  "text-white hover:text-white hover:bg-white/20", 
                  location.pathname.startsWith('/admin') && "font-bold border-b-2 border-white rounded-none"
                )}
                onClick={() => navigate('/admin')}
              >
                Admin
              </Button>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <Bell className="h-5 w-5" />
            </Button>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="rounded-full bg-white/20 text-white hover:bg-white/30 h-10 px-4 flex items-center gap-2"
                  >
                    <div className="h-6 w-6 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                      <span className="text-xs font-bold">
                        {profile?.full_name ? profile.full_name.substring(0, 2).toUpperCase() : user.email?.substring(0, 2).toUpperCase() || "U"}
                      </span>
                    </div>
                    <span className="hidden md:inline">{profile?.full_name || user.email?.split('@')[0] || "User"}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                    Dashboard
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem onClick={() => navigate('/admin')}>
                      Admin Panel
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleLogout}>
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                variant="secondary"
                size="sm"
                className="bg-white text-primary hover:bg-white/90"
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
      
      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Campus Connect</h3>
              <p className="text-slate-300">Your gateway to campus events and opportunities.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><button onClick={() => navigate('/')} className="text-slate-300 hover:text-white">Home</button></li>
                <li><button onClick={() => navigate('/events')} className="text-slate-300 hover:text-white">Events</button></li>
                <li><button onClick={() => navigate('/about')} className="text-slate-300 hover:text-white">About</button></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <p className="text-slate-300">support@campusconnect.edu</p>
              <p className="text-slate-300">123-456-7890</p>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>© {new Date().getFullYear()} Campus Connect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
