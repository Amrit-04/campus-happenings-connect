
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  User,
  ArrowLeft, 
  Share2,
  CalendarPlus,
  BadgeAlert
} from 'lucide-react';
import Layout from '@/components/Layout';
import EventRegistrationForm from '@/components/EventRegistrationForm';
import { Event } from '@/types/Event';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  getEventById, 
  isUserRegistered,
  getRegistrationsByEvent
} from '@/services/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const EventDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [registered, setRegistered] = useState<boolean>(false);
  const [registrationOpen, setRegistrationOpen] = useState<boolean>(false);
  
  useEffect(() => {
    if (id) {
      const foundEvent = getEventById(id);
      if (foundEvent) {
        setEvent(foundEvent);
      } else {
        navigate('/events', { replace: true });
      }
    }
  }, [id, navigate]);
  
  useEffect(() => {
    if (event && user) {
      setRegistered(isUserRegistered(user.id, event.id));
    } else {
      setRegistered(false);
    }
  }, [event, user]);
  
  if (!event) {
    return null; // Loading state or redirecting
  }
  
  const handleRegistrationSuccess = () => {
    setRegistrationOpen(false);
    setRegistered(true);
    // Refresh event data to update attendee count
    const updatedEvent = getEventById(event.id);
    if (updatedEvent) {
      setEvent(updatedEvent);
    }
  };
  
  const isDeadlinePassed = event.registrationDeadline 
    ? new Date(event.registrationDeadline) < new Date() 
    : false;
    
  const isEventFull = event.maxAttendees 
    ? event.currentAttendees >= event.maxAttendees 
    : false;
    
  const canRegister = user && !registered && !isDeadlinePassed && !isEventFull;
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: `Check out this event: ${event.title}`,
        url: window.location.href,
      }).catch(err => {
        console.error('Share failed:', err);
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied to clipboard",
        description: "You can now share this event with others.",
      });
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <Button 
          variant="ghost" 
          className="mb-2"
          onClick={() => navigate('/events')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Events
        </Button>
        
        {/* Event Header */}
        <div className="relative rounded-lg overflow-hidden">
          {event.image ? (
            <div className="relative h-64 w-full">
              <img 
                src={event.image} 
                alt={event.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <div className="p-6 text-white">
                  <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
                  
                  <div className="flex flex-wrap gap-2 items-center">
                    <Badge className="bg-white text-primary">
                      {event.category}
                    </Badge>
                    
                    {registered && (
                      <Badge className="bg-green-500">
                        Registered
                      </Badge>
                    )}
                    
                    {isEventFull && (
                      <Badge className="bg-red-500">
                        Full
                      </Badge>
                    )}
                    
                    {isDeadlinePassed && (
                      <Badge className="bg-orange-500">
                        Registration Closed
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-muted p-6">
              <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
              
              <div className="flex flex-wrap gap-2 items-center">
                <Badge>
                  {event.category}
                </Badge>
                
                {registered && (
                  <Badge variant="outline" className="bg-green-500 text-white">
                    Registered
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Event Actions */}
        <div className="flex flex-wrap gap-3">
          {canRegister && (
            <Dialog open={registrationOpen} onOpenChange={setRegistrationOpen}>
              <DialogTrigger asChild>
                <Button>
                  <CalendarPlus className="mr-2 h-4 w-4" />
                  Register for Event
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Register for {event.title}</DialogTitle>
                </DialogHeader>
                <EventRegistrationForm 
                  event={event} 
                  onSuccess={handleRegistrationSuccess} 
                />
              </DialogContent>
            </Dialog>
          )}
          
          {registered && (
            <Button variant="outline" className="bg-green-50">
              <BadgeAlert className="mr-2 h-4 w-4 text-green-500" />
              You're Registered
            </Button>
          )}
          
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          
          {isAdmin() && (
            <Button 
              variant="outline" 
              className="ml-auto"
              onClick={() => navigate(`/admin/events/edit/${event.id}`)}
            >
              Edit Event
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Event Details */}
          <div className="md:col-span-2 space-y-6">
            <div className="prose max-w-none">
              <h2>About This Event</h2>
              <p>{event.description}</p>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Event Details</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 mr-3 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Date</p>
                    <p>
                      {format(new Date(event.date), 'EEEE, MMMM d, yyyy')}
                      {event.endDate && event.endDate !== event.date && (
                        <> - {format(new Date(event.endDate), 'EEEE, MMMM d, yyyy')}</>
                      )}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="h-5 w-5 mr-3 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Time</p>
                    <p>{format(new Date(event.date), 'h:mm a')}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-3 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p>{event.location}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <User className="h-5 w-5 mr-3 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Organizer</p>
                    <p>{event.organizer}</p>
                  </div>
                </div>
                
                {event.registrationDeadline && (
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 mr-3 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Registration Deadline</p>
                      <p>{format(new Date(event.registrationDeadline), 'MMMM d, yyyy')}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Registration Status */}
          <div className="space-y-6">
            <div className="bg-muted rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Registration Status</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-muted-foreground" />
                    <span>
                      {event.currentAttendees}
                      {event.maxAttendees && <> / {event.maxAttendees}</>}
                    </span>
                  </div>
                  
                  <span className="text-sm text-muted-foreground">
                    {event.maxAttendees
                      ? `${Math.round((event.currentAttendees / event.maxAttendees) * 100)}% Full`
                      : 'Open Registration'}
                  </span>
                </div>
                
                {event.maxAttendees && (
                  <Progress 
                    value={(event.currentAttendees / event.maxAttendees) * 100} 
                    className="h-2"
                  />
                )}
                
                <div className="text-sm text-muted-foreground">
                  {isEventFull ? (
                    <p className="text-red-500">This event is full.</p>
                  ) : isDeadlinePassed ? (
                    <p className="text-orange-500">Registration is closed.</p>
                  ) : event.registrationDeadline ? (
                    <p>
                      Registration closes on {format(new Date(event.registrationDeadline), 'MMMM d, yyyy')}
                    </p>
                  ) : (
                    <p>Registration is open</p>
                  )}
                </div>
              </div>
            </div>
            
            {!user && (
              <div className="bg-primary/10 rounded-lg p-6 text-center">
                <p className="mb-4">You need to be logged in to register for this event.</p>
                <Button onClick={() => navigate('/login')}>
                  Log In to Register
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EventDetailsPage;
