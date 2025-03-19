
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar, Clock, MapPin, Trash2 } from 'lucide-react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Event, Registration } from '@/types/Event';
import { 
  getRegistrationsByUser, 
  getEventById 
} from '@/services/mockData';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';

type RegistrationWithEvent = {
  registration: Registration;
  event: Event;
};

const MyRegistrationsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState<RegistrationWithEvent[]>([]);
  
  useEffect(() => {
    if (user) {
      const userRegistrations = getRegistrationsByUser(user.id);
      
      const registrationsWithEvents: RegistrationWithEvent[] = userRegistrations
        .map(registration => {
          const event = getEventById(registration.eventId);
          return event ? { registration, event } : null;
        })
        .filter((item): item is RegistrationWithEvent => item !== null);
      
      setRegistrations(registrationsWithEvents);
    }
  }, [user]);

  // Group registrations by upcoming and past events
  const now = new Date();
  const upcomingRegistrations = registrations.filter(
    item => new Date(item.event.date) >= now
  );
  const pastRegistrations = registrations.filter(
    item => new Date(item.event.date) < now
  );
  
  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Event Registrations</h1>
          <p className="text-muted-foreground">
            View and manage your registered events
          </p>
        </div>
        
        {registrations.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-medium mb-2">You haven't registered for any events yet</h2>
            <p className="text-muted-foreground mb-6">Check out upcoming events and register for ones that interest you.</p>
            <Button onClick={() => navigate('/events')}>
              Browse Events
            </Button>
          </div>
        ) : (
          <>
            {/* Upcoming Registrations */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Upcoming Events</h2>
              
              {upcomingRegistrations.length === 0 ? (
                <p className="text-muted-foreground">You don't have any upcoming event registrations.</p>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {upcomingRegistrations.map(({ registration, event }) => (
                    <Card key={registration.id} className="overflow-hidden">
                      {event.image && (
                        <div className="h-32 overflow-hidden">
                          <img
                            src={event.image}
                            alt={event.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      
                      <CardHeader className="pb-2">
                        <CardTitle 
                          className="text-xl cursor-pointer hover:text-primary" 
                          onClick={() => navigate(`/events/${event.id}`)}
                        >
                          {event.title}
                        </CardTitle>
                        <CardDescription>
                          Registered on {format(new Date(registration.registrationDate), 'MMM d, yyyy')}
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center text-sm">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{format(new Date(event.date), 'EEEE, MMMM d, yyyy')}</span>
                          </div>
                          
                          <div className="flex items-center text-sm">
                            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{format(new Date(event.date), 'h:mm a')}</span>
                          </div>
                          
                          <div className="flex items-center text-sm">
                            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{event.location}</span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center pt-2">
                          <Badge>{event.category}</Badge>
                          
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate(`/events/${event.id}`)}
                          >
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
            
            {/* Past Registrations */}
            {pastRegistrations.length > 0 && (
              <div className="space-y-4">
                <Separator />
                <h2 className="text-2xl font-semibold">Past Events</h2>
                
                <div className="grid gap-4 md:grid-cols-2">
                  {pastRegistrations.map(({ registration, event }) => (
                    <Card key={registration.id}>
                      <CardHeader className="pb-2">
                        <CardTitle 
                          className="text-xl cursor-pointer hover:text-primary" 
                          onClick={() => navigate(`/events/${event.id}`)}
                        >
                          {event.title}
                        </CardTitle>
                        <CardDescription>
                          Attended on {format(new Date(event.date), 'MMM d, yyyy')}
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent className="space-y-2">
                        <div className="flex items-center text-sm">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{event.location}</span>
                        </div>
                        
                        <div className="flex justify-between items-center pt-2">
                          <Badge variant="outline">{event.category}</Badge>
                          
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => navigate(`/events/${event.id}`)}
                          >
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default MyRegistrationsPage;
