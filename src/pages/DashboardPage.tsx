
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Users, Bell, LayoutDashboard } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  getAllEvents,
  getEventById
} from '@/services/mockData';
import { useNotifications } from '@/contexts/NotificationContext';
import { supabase } from '@/integrations/supabase/client';
import { Event } from '@/types/Event';
import { useToast } from '@/hooks/use-toast';

const DashboardPage = () => {
  const { user, profile } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [registeredEvents, setRegisteredEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    const fetchUserRegistrations = async () => {
      setIsLoading(true);
      try {
        // Fetch registrations directly from Supabase
        const { data: registrations, error } = await supabase
          .from('event_registrations')
          .select('event_id')
          .eq('user_id', user.id);
        
        if (error) {
          console.error('Error fetching registrations:', error);
          toast({
            title: "Error loading registrations",
            description: "There was a problem loading your registered events.",
            variant: "destructive",
          });
          setRegisteredEvents([]);
          return;
        }
        
        // Get the event details for each registration
        if (registrations && registrations.length > 0) {
          const events = registrations.map(reg => {
            const event = getEventById(reg.event_id);
            return event;
          }).filter(Boolean) as Event[];
          
          setRegisteredEvents(events);
        } else {
          setRegisteredEvents([]);
        }
      } catch (error) {
        console.error('Error in fetchUserRegistrations:', error);
        setRegisteredEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRegistrations();
  }, [user, navigate, toast]);
  
  const events = getAllEvents();
  const upcomingEvents = events
    .filter(event => new Date(event.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);
    
  if (!user) {
    return null;
  }

  return (
    <Layout>
      <div className="bg-gradient-to-r from-purple-800 to-blue-600 py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-white opacity-80">Welcome back, {profile?.full_name || user.email}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-primary" />
                My Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{registeredEvents.length}</div>
              <p className="text-xs text-muted-foreground">
                Events you've registered for
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Bell className="h-4 w-4 mr-2 text-primary" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{unreadCount}</div>
              <p className="text-xs text-muted-foreground">
                Unread notifications
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Users className="h-4 w-4 mr-2 text-primary" />
                Community
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">124</div>
              <p className="text-xs text-muted-foreground">
                Active student connections
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="registered" className="space-y-4">
          <TabsList>
            <TabsTrigger value="registered">My Registered Events</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
          </TabsList>
          
          <TabsContent value="registered" className="space-y-4">
            {isLoading ? (
              <div className="text-center py-10">
                <div className="animate-pulse flex flex-col items-center">
                  <div className="h-10 w-10 bg-slate-200 rounded-full mb-4"></div>
                  <div className="h-4 w-48 bg-slate-200 rounded mb-2"></div>
                  <div className="h-4 w-32 bg-slate-200 rounded"></div>
                </div>
              </div>
            ) : registeredEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {registeredEvents.map(event => event && (
                  <Card key={event.id} className="overflow-hidden">
                    {event.image && (
                      <div className="h-40 overflow-hidden">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardHeader className="pb-2">
                      <CardTitle>{event.title}</CardTitle>
                      <CardDescription>
                        {new Date(event.date).toLocaleDateString()} • {event.location}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        className="w-full"
                        onClick={() => navigate(`/events/${event.id}`)}
                      >
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <LayoutDashboard className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No registered events</h3>
                <p className="text-muted-foreground mb-4">
                  You haven't registered for any events yet
                </p>
                <Button onClick={() => navigate('/events')}>
                  Browse Events
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="upcoming" className="space-y-4">
            {upcomingEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcomingEvents.map(event => (
                  <Card key={event.id} className="overflow-hidden">
                    {event.image && (
                      <div className="h-40 overflow-hidden">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardHeader className="pb-2">
                      <CardTitle>{event.title}</CardTitle>
                      <CardDescription>
                        {new Date(event.date).toLocaleDateString()} • {event.location}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        className="w-full"
                        onClick={() => navigate(`/events/${event.id}`)}
                      >
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <Calendar className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No upcoming events</h3>
                <p className="text-muted-foreground mb-4">
                  There are no upcoming events at the moment
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default DashboardPage;
