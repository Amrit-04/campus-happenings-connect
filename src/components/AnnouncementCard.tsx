
import React from 'react';
import { format } from 'date-fns';
import { AlertCircle, User } from 'lucide-react';
import { Announcement } from '@/types/Event';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface AnnouncementCardProps {
  announcement: Announcement;
  className?: string;
}

const AnnouncementCard: React.FC<AnnouncementCardProps> = ({ announcement, className }) => {
  return (
    <Card 
      className={cn(
        className,
        announcement.important && "border-secondary"
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg flex items-center">
            {announcement.important && (
              <AlertCircle className="h-5 w-5 text-secondary mr-2" />
            )}
            {announcement.title}
          </CardTitle>
          <Badge variant="outline">
            {format(new Date(announcement.date), 'MMM d')}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-2">
        <p className="text-muted-foreground">{announcement.content}</p>
        
        <div className="flex items-center text-sm text-muted-foreground">
          <User className="h-4 w-4 mr-1" />
          <span>{announcement.author}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnnouncementCard;
