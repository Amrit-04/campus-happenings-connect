
import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import Layout from '@/components/Layout';
import EventCard from '@/components/EventCard';
import EventSearchFilter from '@/components/EventSearchFilter';
import { Event, EventCategory } from '@/types/Event';
import { 
  getAllEvents,
  getEventsByCategory,
  searchEvents
} from '@/services/mockData';

const EventsPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<EventCategory[]>([]);
  const [sortOption, setSortOption] = useState('date-asc');
  
  // Initial load of events
  useEffect(() => {
    setEvents(getAllEvents());
  }, []);
  
  // Handler for search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (!query && selectedCategories.length === 0) {
      setEvents(getAllEvents());
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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold flex items-center">
            <Calendar className="mr-2 h-6 w-6" />
            Campus Events
          </h1>
        </div>
        
        <EventSearchFilter
          onSearch={handleSearch}
          onFilter={applyFilters}
          onSort={handleSort}
        />
        
        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl font-medium">No events found</p>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default EventsPage;
