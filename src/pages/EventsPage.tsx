
import React, { useState, useEffect } from 'react';
import { Calendar, ArrowRight } from 'lucide-react';
import Layout from '@/components/Layout';
import EventCard from '@/components/EventCard';
import EventSearchFilter from '@/components/EventSearchFilter';
import { Event, EventCategory } from '@/types/Event';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  getAllEvents,
  getFeaturedEvents,
  getCurrentEvents,
  getUpcomingEvents,
  getEventsByCategory,
  searchEvents
} from '@/services/mockData';

const EventsPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<EventCategory[]>([]);
  const [sortOption, setSortOption] = useState('date-asc');
  const [activeTab, setActiveTab] = useState('all');
  
  // Initial load of events based on active tab
  useEffect(() => {
    if (activeTab === 'all') {
      setEvents(getAllEvents());
    } else if (activeTab === 'featured') {
      setEvents(getFeaturedEvents());
    } else if (activeTab === 'current') {
      setEvents(getCurrentEvents());
    } else if (activeTab === 'upcoming') {
      setEvents(getUpcomingEvents());
    }
  }, [activeTab]);
  
  // Handler for search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (!query && selectedCategories.length === 0) {
      // Reset to the current tab's events
      if (activeTab === 'all') {
        setEvents(getAllEvents());
      } else if (activeTab === 'featured') {
        setEvents(getFeaturedEvents());
      } else if (activeTab === 'current') {
        setEvents(getCurrentEvents());
      } else if (activeTab === 'upcoming') {
        setEvents(getUpcomingEvents());
      }
    } else if (!query) {
      applyFilters(selectedCategories);
    } else {
      let results = searchEvents(query);
      
      // Apply category filter on search results if categories are selected
      if (selectedCategories.length > 0) {
        results = results.filter(event => selectedCategories.includes(event.category));
      }
      
      // Apply sorting
      results = sortEvents(results, sortOption);
      
      setEvents(results);
    }
  };
  
  // Handler for category filter
  const applyFilters = (categories: EventCategory[]) => {
    setSelectedCategories(categories);
    
    let filtered = searchQuery ? searchEvents(searchQuery) : getAllEvents();
    
    // If on a specific tab, filter from that tab's events
    if (activeTab === 'featured') {
      filtered = searchQuery ? filtered.filter(event => event.isFeatured) : getFeaturedEvents();
    } else if (activeTab === 'current') {
      filtered = searchQuery ? filtered.filter(event => {
        const now = new Date();
        const eventDate = new Date(event.date);
        return eventDate <= now && (!event.endDate || new Date(event.endDate) >= now);
      }) : getCurrentEvents();
    } else if (activeTab === 'upcoming') {
      filtered = searchQuery ? filtered.filter(event => {
        const now = new Date();
        const eventDate = new Date(event.date);
        return eventDate > now;
      }) : getUpcomingEvents();
    }
    
    if (categories.length > 0) {
      filtered = filtered.filter(event => categories.includes(event.category));
    }
    
    // Apply sorting
    filtered = sortEvents(filtered, sortOption);
    
    setEvents(filtered);
  };
  
  // Handler for sorting
  const handleSort = (sortBy: string) => {
    setSortOption(sortBy);
    setEvents(prevEvents => sortEvents([...prevEvents], sortBy));
  };
  
  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSearchQuery('');
    setSelectedCategories([]);
    
    if (tab === 'all') {
      setEvents(getAllEvents());
    } else if (tab === 'featured') {
      setEvents(getFeaturedEvents());
    } else if (tab === 'current') {
      setEvents(getCurrentEvents());
    } else if (tab === 'upcoming') {
      setEvents(getUpcomingEvents());
    }
  };
  
  // Sort function
  const sortEvents = (eventsToSort: Event[], sortBy: string): Event[] => {
    switch (sortBy) {
      case 'date-asc':
        return [...eventsToSort].sort((a, b) => 
          new Date(a.date).getTime() - new Date(b.date).getTime()
        );
      case 'date-desc':
        return [...eventsToSort].sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
      case 'title-asc':
        return [...eventsToSort].sort((a, b) => 
          a.title.localeCompare(b.title)
        );
      case 'title-desc':
        return [...eventsToSort].sort((a, b) => 
          b.title.localeCompare(a.title)
        );
      case 'popularity':
        return [...eventsToSort].sort((a, b) => 
          b.currentAttendees - a.currentAttendees
        );
      default:
        return eventsToSort;
    }
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold flex items-center logo-gradient">
            <Calendar className="mr-2 h-6 w-6" />
            Campus Events
          </h1>
        </div>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Events</TabsTrigger>
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="current">Happening Now</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          </TabsList>
          
          <div className="mt-6 bg-card/50 backdrop-blur-sm rounded-xl p-4 border border-border">
            <EventSearchFilter
              onSearch={handleSearch}
              onFilter={applyFilters}
              onSort={handleSort}
            />
          </div>
          
          <TabsContent value="all" className="mt-6">
            {events.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 space-card p-8">
                <p className="text-xl font-medium">No events found</p>
                <p className="text-muted-foreground">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="featured" className="mt-6">
            {events.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 space-card p-8">
                <p className="text-xl font-medium">No featured events found</p>
                <p className="text-muted-foreground">
                  Check back later for featured events
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="current" className="mt-6">
            {events.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 space-card p-8">
                <p className="text-xl font-medium">No events happening now</p>
                <p className="text-muted-foreground">
                  Check back later for ongoing events
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="upcoming" className="mt-6">
            {events.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 space-card p-8">
                <p className="text-xl font-medium">No upcoming events found</p>
                <p className="text-muted-foreground">
                  Check back later for future events
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default EventsPage;
