
import React, { useState } from 'react';
import { Search, Filter, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { eventCategories } from '@/services/mockData';
import { EventCategory } from '@/types/Event';

interface SearchFilterProps {
  onSearch: (query: string) => void;
  onFilter: (categories: EventCategory[]) => void;
  onSort: (sortBy: string) => void;
}

const EventSearchFilter: React.FC<SearchFilterProps> = ({
  onSearch,
  onFilter,
  onSort
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<EventCategory[]>([]);
  const [sortBy, setSortBy] = useState('date-asc');
  
  const handleSearch = () => {
    onSearch(searchQuery);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  const toggleCategory = (category: EventCategory) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };
  
  const applyFilters = () => {
    onFilter(selectedCategories);
    onSort(sortBy);
  };
  
  const clearFilters = () => {
    setSelectedCategories([]);
    setSortBy('date-asc');
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-grow">
          <Input
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-9"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
              onClick={() => {
                setSearchQuery('');
                onSearch('');
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <Button onClick={handleSearch}>
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filters
              {selectedCategories.length > 0 && (
                <Badge className="ml-2 bg-primary">{selectedCategories.length}</Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Filter Events</SheetTitle>
              <SheetDescription>
                Refine your event search results
              </SheetDescription>
            </SheetHeader>
            
            <div className="py-6 space-y-6">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {eventCategories.map((category) => (
                    <Badge
                      key={category.value}
                      variant={selectedCategories.includes(category.value) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleCategory(category.value)}
                    >
                      {category.label}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Sort By</h3>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sort order" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date-asc">Date (Earliest First)</SelectItem>
                    <SelectItem value="date-desc">Date (Latest First)</SelectItem>
                    <SelectItem value="title-asc">Title (A-Z)</SelectItem>
                    <SelectItem value="title-desc">Title (Z-A)</SelectItem>
                    <SelectItem value="popularity">Popularity</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <SheetFooter className="sm:justify-between flex-row-reverse sm:flex-row">
              <SheetClose asChild>
                <Button onClick={applyFilters}>Apply Filters</Button>
              </SheetClose>
              
              <Button variant="ghost" onClick={clearFilters}>
                Reset
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
      
      {selectedCategories.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm font-medium">Filters:</span>
          {selectedCategories.map((category) => (
            <Badge key={category} variant="secondary" className="flex items-center gap-1">
              {eventCategories.find(c => c.value === category)?.label}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => {
                  const updated = selectedCategories.filter(c => c !== category);
                  setSelectedCategories(updated);
                  onFilter(updated);
                }}
              />
            </Badge>
          ))}
          
          <Button
            variant="ghost"
            size="sm"
            className="text-xs h-7"
            onClick={() => {
              setSelectedCategories([]);
              onFilter([]);
            }}
          >
            Clear All
          </Button>
        </div>
      )}
    </div>
  );
};

export default EventSearchFilter;
