import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Calendar, ChevronDown, Home, Menu, User, LayoutDashboard, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import NotificationDropdown from './NotificationDropdown';
interface LayoutProps {
  children: React.ReactNode;
}
const Layout: React.FC<LayoutProps> = ({
  children
}) => {
  const {
    user,
    profile,
    logout
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  const navigationItems = [{
    name: 'Home',
    path: '/',
    icon: Home
  }, {
    name: 'Events',
    path: '/events',
    icon: Calendar
  }, {
    name: 'About',
    path: '/about',
    icon: BookOpen
  }];
  if (user) {
    navigationItems.push({
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard
    });
  }
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Generate random particles for the background
  const particles = Array.from({
    length: 15
  }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.random() * 5 + 2,
    type: i % 3 === 0 ? 'particle-purple' : i % 3 === 1 ? 'particle-blue' : 'particle-white',
    animation: i % 3 === 0 ? 'animate-float-1' : i % 3 === 1 ? 'animate-float-2' : 'animate-float-3'
  }));
  return <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background particles */}
      {particles.map(particle => <div key={particle.id} className={`particle ${particle.type} ${particle.animation}`} style={{
      left: particle.left,
      top: particle.top,
      width: `${particle.size}px`,
      height: `${particle.size}px`
    }} />)}

      {/* Header */}
      <header className="bg-background border-b border-border/30 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Sheet>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" className="text-foreground hover:bg-muted">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 bg-card border-r border-border">
                <div className="flex flex-col h-full">
                  <div className="py-4 border-b border-border">
                    <h2 className="text-xl font-bold logo-gradient">
                      Campus Connect
                    </h2>
                  </div>
                  <nav className="flex flex-col space-y-4 mt-8 flex-grow">
                    {navigationItems.map(item => <Button key={item.path} variant={isActive(item.path) ? "secondary" : "ghost"} className={cn("justify-start", isActive(item.path) && "bg-secondary/20 font-medium")} onClick={() => navigate(item.path)}>
                        <item.icon className="mr-2 h-5 w-5" />
                        {item.name}
                      </Button>)}
                  </nav>
                  
                  {user && <div className="mt-auto border-t border-border pt-4">
                      <Button variant="ghost" className="w-full justify-start text-destructive" onClick={handleLogout}>
                        Log Out
                      </Button>
                    </div>}
                </div>
              </SheetContent>
            </Sheet>
            <h1 className="text-xl font-bold cursor-pointer logo-gradient" onClick={() => navigate('/')}>
              Campus Connect
            </h1>
          </div>
          
          <div className="hidden lg:flex items-center space-x-6">
            {navigationItems.map(item => <Button key={item.path} variant="ghost" className={cn("text-foreground hover:text-white hover:bg-muted", isActive(item.path) && "font-bold border-b-2 border-secondary rounded-none")} onClick={() => navigate(item.path)}>
                {item.name}
              </Button>)}
          </div>
          
          <div className="flex items-center space-x-2">
            {user && <NotificationDropdown />}
            
            {user ? <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="rounded-full bg-muted text-foreground hover:bg-muted/60 h-10 px-4 flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center">
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
                  <DropdownMenuItem onClick={handleLogout}>
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu> : <Button variant="secondary" size="sm" onClick={() => navigate('/login')}>
                Log In
              </Button>}
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-grow">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-card/50 text-foreground py-8 border-t border-border/30 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 logo-gradient">Campus Connect</h3>
              <p className="text-muted-foreground">Your gateway to campus events and opportunities.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><button onClick={() => navigate('/')} className="text-muted-foreground hover:text-foreground">Home</button></li>
                <li><button onClick={() => navigate('/events')} className="text-muted-foreground hover:text-foreground">Events</button></li>
                <li><button onClick={() => navigate('/about')} className="text-muted-foreground hover:text-foreground">About</button></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <p className="text-muted-foreground">support@campusconnect.edu</p>
              <p className="text-muted-foreground">999-846-1268</p>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>© {new Date().getFullYear()} Campus Connect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>;
};
export default Layout;