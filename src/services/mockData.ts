
import { Event, Announcement, Registration, EventCategory } from "../types/Event";

// Sample events data
export const events: Event[] = [
  {
    id: "1",
    title: "Annual Tech Hackathon",
    description: "Join us for a 24-hour coding challenge to build innovative solutions for campus problems.",
    date: new Date(Date.now() + 86400000 * 7).toISOString(), // 7 days from now
    location: "Engineering Building, Room 301",
    category: "hackathon",
    organizer: "Computer Science Department",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b",
    registrationDeadline: new Date(Date.now() + 86400000 * 5).toISOString(), // 5 days from now
    maxAttendees: 100,
    currentAttendees: 42,
    isFeatured: true,
  },
  {
    id: "2",
    title: "Spring Career Fair",
    description: "Connect with over 50 employers looking to hire interns and graduates.",
    date: new Date(Date.now() + 86400000 * 14).toISOString(), // 14 days from now
    location: "Student Union Hall",
    category: "fair",
    organizer: "Career Services",
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d",
    registrationDeadline: new Date(Date.now() + 86400000 * 10).toISOString(), // 10 days from now
    maxAttendees: 500,
    currentAttendees: 123,
    isFeatured: true,
  },
  {
    id: "3",
    title: "AI Workshop Series",
    description: "Learn the fundamentals of artificial intelligence in this hands-on workshop series.",
    date: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days from now
    endDate: new Date(Date.now() + 86400000 * 10).toISOString(), // 10 days from now
    location: "Virtual",
    category: "workshop",
    organizer: "AI Research Lab",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998",
    registrationDeadline: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
    maxAttendees: 200,
    currentAttendees: 98,
    isFeatured: false,
  },
  {
    id: "4",
    title: "Campus Music Festival",
    description: "A celebration of student musical talent featuring live performances across genres.",
    date: new Date(Date.now() + 86400000 * 21).toISOString(), // 21 days from now
    location: "Campus Amphitheater",
    category: "cultural",
    organizer: "Student Activities Board",
    image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a",
    registrationDeadline: new Date(Date.now() + 86400000 * 18).toISOString(), // 18 days from now
    maxAttendees: 1000,
    currentAttendees: 210,
    isFeatured: true,
  },
  {
    id: "5",
    title: "Research Symposium",
    description: "Undergraduate and graduate students present their research projects.",
    date: new Date().toISOString(), // Today
    location: "Science Center, Main Hall",
    category: "conference",
    organizer: "Office of Research",
    image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94",
    maxAttendees: 300,
    currentAttendees: 275,
    isFeatured: false,
  }
];

// Sample announcements
export const announcements: Announcement[] = [
  {
    id: "1",
    title: "Campus Wi-Fi Upgrade",
    content: "The campus Wi-Fi network will be upgraded this weekend. Expect intermittent connectivity.",
    date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    author: "IT Services",
    important: true,
  },
  {
    id: "2",
    title: "Library Extended Hours",
    content: "The library will be open 24/7 during finals week to accommodate student study needs.",
    date: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    author: "University Library",
    important: false,
  },
  {
    id: "3",
    title: "New Course Registration",
    content: "Course registration for the Fall semester opens next Monday at 8 AM.",
    date: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
    author: "Registrar's Office",
    important: true,
  }
];

// Mock registrations
export const registrations: Registration[] = [];

// Categories for filtering
export const eventCategories: { value: EventCategory; label: string }[] = [
  { value: "hackathon", label: "Hackathons" },
  { value: "workshop", label: "Workshops" },
  { value: "fair", label: "Fairs" },
  { value: "seminar", label: "Seminars" },
  { value: "conference", label: "Conferences" },
  { value: "cultural", label: "Cultural Events" },
  { value: "sports", label: "Sports Events" },
  { value: "other", label: "Other Events" },
];

// Mock event data functions
export const getAllEvents = (): Event[] => {
  return [...events];
};

export const getEventById = (id: string): Event | undefined => {
  return events.find(event => event.id === id);
};

export const getFeaturedEvents = (): Event[] => {
  return events.filter(event => event.isFeatured);
};

export const getUpcomingEvents = (): Event[] => {
  const now = new Date();
  return events
    .filter(event => new Date(event.date) > now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export const getCurrentEvents = (): Event[] => {
  const now = new Date();
  return events.filter(
    event => {
      const eventDate = new Date(event.date);
      const eventEndDate = event.endDate ? new Date(event.endDate) : new Date(eventDate);
      eventEndDate.setHours(23, 59, 59, 999); // End of the day
      return eventDate <= now && eventEndDate >= now;
    }
  );
};

export const getEventsByCategory = (category: EventCategory): Event[] => {
  return events.filter(event => event.category === category);
};

export const searchEvents = (query: string): Event[] => {
  const lowerCaseQuery = query.toLowerCase();
  return events.filter(
    event => 
      event.title.toLowerCase().includes(lowerCaseQuery) ||
      event.description.toLowerCase().includes(lowerCaseQuery) ||
      event.organizer.toLowerCase().includes(lowerCaseQuery) ||
      event.location.toLowerCase().includes(lowerCaseQuery)
  );
};

// Functions for announcements
export const getAllAnnouncements = (): Announcement[] => {
  return [...announcements].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};

// Registration functions
export const registerForEvent = (
  eventId: string, 
  userId: string, 
  attendeeInfo: Registration["attendeeInfo"]
): Registration => {
  const newRegistration: Registration = {
    id: Math.random().toString(36).substr(2, 9),
    eventId,
    userId,
    registrationDate: new Date().toISOString(),
    attendeeInfo
  };
  
  // Find the event and update attendee count
  const event = events.find(e => e.id === eventId);
  if (event) {
    event.currentAttendees += 1;
  }
  
  registrations.push(newRegistration);
  return newRegistration;
};

export const getRegistrationsByUser = (userId: string): Registration[] => {
  return registrations.filter(reg => reg.userId === userId);
};

export const getRegistrationsByEvent = (eventId: string): Registration[] => {
  return registrations.filter(reg => reg.eventId === eventId);
};

export const isUserRegistered = (userId: string, eventId: string): boolean => {
  return registrations.some(reg => reg.userId === userId && reg.eventId === eventId);
};

// Admin functions
export const addEvent = (event: Omit<Event, "id" | "currentAttendees">): Event => {
  const newEvent: Event = {
    ...event,
    id: Math.random().toString(36).substr(2, 9),
    currentAttendees: 0
  };
  events.push(newEvent);
  return newEvent;
};

export const updateEvent = (id: string, updates: Partial<Omit<Event, "id">>): Event | undefined => {
  const index = events.findIndex(e => e.id === id);
  if (index === -1) return undefined;
  
  events[index] = { ...events[index], ...updates };
  return events[index];
};

export const deleteEvent = (id: string): boolean => {
  const index = events.findIndex(e => e.id === id);
  if (index === -1) return false;
  
  events.splice(index, 1);
  return true;
};

export const addAnnouncement = (announcement: Omit<Announcement, "id" | "date">): Announcement => {
  const newAnnouncement: Announcement = {
    ...announcement,
    id: Math.random().toString(36).substr(2, 9),
    date: new Date().toISOString()
  };
  announcements.push(newAnnouncement);
  return newAnnouncement;
};
