
import React from 'react';
import { format } from 'date-fns';
import { Calendar, MapPin, User, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Event } from '@/types/Event';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface EventCardProps {
  event: Event;
  className?: string;
}

const EventCard: React.FC<EventCardProps> = ({ event, className }) => {
  const navigate = useNavigate();
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'hackathon': return 'bg-blue-500';
      case 'workshop': return 'bg-green-500';
      case 'fair': return 'bg-purple-500';
      case 'seminar': return 'bg-yellow-500';
      case 'conference': return 'bg-teal-500';
      case 'cultural': return 'bg-orange-500';
      case 'sports': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };
  
  const isMultiDay = event.endDate && event.endDate !== event.date;
  
  const registrationProgress = event.maxAttendees 
    ? (event.currentAttendees / event.maxAttendees) * 100
    : 0;
    
  const isTodayEvent = new Date(event.date).toDateString() === new Date().toDateString();
  
  const hasRegistrationDeadline = event.registrationDeadline 
    ? new Date(event.registrationDeadline) > new Date()
    : true;

  const handleClick = () => {
    navigate(`/events/${event.id}`);
  };

  return (
    <Card 
      className={cn(
        "event-card cursor-pointer overflow-hidden", 
        event.isFeatured && "border-secondary", 
        className
      )}
      onClick={handleClick}
    >
      {event.image && (
        <div className="h-48 overflow-hidden">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      )}
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{event.title}</CardTitle>
          <Badge 
            className={cn(getCategoryColor(event.category), "text-white")}
          >
            {event.category}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-2">
        <p className="text-muted-foreground line-clamp-2">{event.description}</p>
        
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 mr-1" />
          <span>
            {format(new Date(event.date), 'MMM d, yyyy')}
            {isMultiDay && ` - ${format(new Date(event.endDate!), 'MMM d, yyyy')}`}
            {isTodayEvent && <Badge className="ml-2 bg-secondary text-secondary-foreground">Today</Badge>}
          </span>
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="h-4 w-4 mr-1" />
          <span>{format(new Date(event.date), 'h:mm a')}</span>
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{event.location}</span>
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col items-start pt-2">
        {event.maxAttendees && (
          <div className="w-full space-y-1">
            <div className="flex justify-between text-sm">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                <span>{event.currentAttendees} / {event.maxAttendees}</span>
              </div>
              
              {!hasRegistrationDeadline && (
                <Badge variant="outline" className="text-xs">Registration Closed</Badge>
              )}
            </div>
            
            <Progress value={registrationProgress} className="h-2" />
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default EventCard;
