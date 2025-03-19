
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar, Plus, Search, X, Edit, Trash, ArrowLeft } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useAuth } from '@/contexts/AuthContext';
import { Event } from '@/types/Event';
import { getAllEvents, deleteEvent } from '@/services/mockData';
import { useToast } from '@/hooks/use-toast';

const ManageEventsPage = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  
  const [events, setEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);
  
  // Redirect non-admin users
  useEffect(() => {
    if (user && !isAdmin()) {
      navigate('/');
    }
  }, [user, isAdmin, navigate]);
  
  // Load events
  useEffect(() => {
    if (user && isAdmin()) {
      setEvents(getAllEvents());
    }
  }, [user, isAdmin]);
  
  if (!user || !isAdmin()) {
    return null;
  }
  
  // Search events
  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.organizer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Handle delete
  const handleDelete = (id: string) => {
    const success = deleteEvent(id);
    
    if (success) {
      toast({
        title: "Event deleted",
        description: "The event has been successfully deleted.",
      });
      setEvents(prev => prev.filter(event => event.id !== id));
    } else {
      toast({
        title: "Error",
        description: "There was an error deleting the event. Please try again.",
        variant: "destructive",
      });
    }
    
    setEventToDelete(null);
  };
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Button 
              variant="ghost" 
              className="mb-2"
              onClick={() => navigate('/admin')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            
            <h1 className="text-3xl font-bold flex items-center">
              <Calendar className="mr-2 h-6 w-6" />
              Manage Events
            </h1>
          </div>
          
          <Button onClick={() => navigate('/admin/events/new')}>
            <Plus className="mr-2 h-4 w-4" />
            New Event
          </Button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Input
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
              onClick={() => setSearchQuery('')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        {/* Events Table */}
        {filteredEvents.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Registrations</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.map((event) => {
                  const eventDate = new Date(event.date);
                  const isUpcoming = eventDate > new Date();
                  const isPast = eventDate < new Date();
                  
                  return (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">
                        <div>
                          {event.title}
                          <div className="flex gap-2 mt-1">
                            <Badge variant="outline">{event.category}</Badge>
                            {event.isFeatured && (
                              <Badge className="bg-secondary text-secondary-foreground">
                                Featured
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{format(eventDate, 'MMM d, yyyy')}</TableCell>
                      <TableCell>{event.location}</TableCell>
                      <TableCell>
                        {event.currentAttendees}
                        {event.maxAttendees && ` / ${event.maxAttendees}`}
                      </TableCell>
                      <TableCell>
                        {isUpcoming ? (
                          <Badge className="bg-green-500 text-white">Upcoming</Badge>
                        ) : isPast ? (
                          <Badge variant="outline">Past</Badge>
                        ) : (
                          <Badge className="bg-blue-500 text-white">Current</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/admin/events/edit/${event.id}`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          
                          <AlertDialog open={eventToDelete === event.id} onOpenChange={(open) => !open && setEventToDelete(null)}>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setEventToDelete(event.id)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the event
                                  and remove all associated registrations.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(event.id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12 border rounded-md">
            <p className="text-xl font-medium">No events found</p>
            <p className="text-muted-foreground mb-6">
              {searchQuery ? "Try a different search term" : "Start by creating your first event"}
            </p>
            {!searchQuery && (
              <Button onClick={() => navigate('/admin/events/new')}>
                <Plus className="mr-2 h-4 w-4" />
                Create First Event
              </Button>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ManageEventsPage;
