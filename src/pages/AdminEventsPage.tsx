
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Users } from 'lucide-react';
import { Event } from '@/types/Event';

type EventWithRegistrationCount = Event & {
  registrationCount: number;
};

const AdminEventsPage = () => {
  const { isAdmin, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [events, setEvents] = useState<EventWithRegistrationCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in and is admin
    if (!user) {
      navigate('/admin-login');
      return;
    }
    
    if (!isAdmin()) {
      toast({
        title: "Access denied",
        description: "You do not have admin privileges.",
        variant: "destructive",
      });
      navigate('/');
      return;
    }

    const fetchEventsWithRegistrations = async () => {
      try {
        setLoading(true);
        
        // For this example, we'll use the mock data for events since it's what the app is currently using
        const { getAllEvents } = await import('@/services/mockData');
        const allEvents = getAllEvents();
        
        // Now fetch registration counts for each event from our actual database
        const eventPromises = allEvents.map(async (event) => {
          const { count, error } = await supabase
            .from('event_registrations')
            .select('*', { count: 'exact', head: true })
            .eq('event_id', event.id);
            
          if (error) {
            console.error('Error fetching registration count:', error);
            return { ...event, registrationCount: 0 };
          }
          
          return { ...event, registrationCount: count || 0 };
        });
        
        const eventsWithCounts = await Promise.all(eventPromises);
        setEvents(eventsWithCounts);
      } catch (error) {
        console.error('Error fetching events data:', error);
        toast({
          title: "Error",
          description: "Failed to load events data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEventsWithRegistrations();
  }, [user, isAdmin, navigate, toast]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Users className="h-6 w-6" /> 
              Event Registration Dashboard
            </CardTitle>
            <CardDescription>
              Overview of registrations for all campus events
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event Name</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead className="text-right">Registrations</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {events.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell className="font-medium">{event.title}</TableCell>
                        <TableCell>
                          {new Date(event.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{event.category}</TableCell>
                        <TableCell>{event.location}</TableCell>
                        <TableCell className="text-right">
                          <span className="font-medium">{event.registrationCount}</span>
                          {event.maxAttendees && (
                            <span className="text-muted-foreground">/{event.maxAttendees}</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AdminEventsPage;
