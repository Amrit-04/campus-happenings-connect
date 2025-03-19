
export type EventCategory = 
  | 'hackathon'
  | 'workshop'
  | 'fair'
  | 'seminar'
  | 'conference'
  | 'cultural'
  | 'sports'
  | 'other';

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string; // ISO date string
  endDate?: string; // ISO date string for multi-day events
  location: string;
  category: EventCategory;
  organizer: string;
  image?: string;
  registrationDeadline?: string;
  maxAttendees?: number;
  currentAttendees: number;
  isFeatured: boolean;
}

export interface Registration {
  id: string;
  eventId: string;
  userId: string;
  registrationDate: string;
  attendeeInfo: {
    name: string;
    email: string;
    studentId?: string;
    department?: string;
  };
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  important: boolean;
}
