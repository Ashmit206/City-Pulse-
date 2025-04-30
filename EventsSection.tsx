import React, { useState, useEffect } from 'react';
import { Calendar, Filter, Clock, MapPin, Tag, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import type { City } from '../context/CityContext';
import { getMockEventsData } from '../services/mockEventsService';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: 'music' | 'sports' | 'arts' | 'food' | 'community';
  description: string;
  imageUrl?: string;
}

interface EventCategory {
  id: string;
  name: string;
  color: string;
}

interface EventsSectionProps {
  city: City;
}

const EventsSection: React.FC<EventsSectionProps> = ({ city }) => {
  const { theme } = useTheme();
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const categories: EventCategory[] = [
    { id: 'music', name: 'Music', color: 'bg-purple-500' },
    { id: 'sports', name: 'Sports', color: 'bg-green-500' },
    { id: 'arts', name: 'Arts', color: 'bg-blue-500' },
    { id: 'food', name: 'Food', color: 'bg-yellow-500' },
    { id: 'community', name: 'Community', color: 'bg-orange-500' },
  ];

  useEffect(() => {
    fetchEvents();
  }, [city]);

  useEffect(() => {
    if (selectedCategories.length === 0) {
      setFilteredEvents(events);
    } else {
      setFilteredEvents(events.filter(event => 
        selectedCategories.includes(event.category)
      ));
    }
  }, [events, selectedCategories]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      // In a real app, we would fetch from a real API using the city ID
      // For now, we'll use mock data
      const eventsData = getMockEventsData(city.id);
      setEvents(eventsData);
      setFilteredEvents(eventsData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching events data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshEvents = async () => {
    setIsRefreshing(true);
    await fetchEvents();
    setTimeout(() => setIsRefreshing(false), 600); // Show refresh animation for at least 600ms
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId) 
        : [...prev, categoryId]
    );
  };

  const getCategoryColor = (category: string) => {
    const found = categories.find(cat => cat.id === category);
    return found ? found.color : 'bg-gray-500';
  };

  if (loading && events.length === 0) {
    return (
      <section id="events" className={`p-6 rounded-xl shadow-md ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="grid gap-4">
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="events" className={`p-6 rounded-xl shadow-md ${theme === 'light' ? 'bg-white' : 'bg-gray-800'} transition-all duration-300`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Events</h2>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <span>Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          <button 
            onClick={refreshEvents} 
            className={`ml-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all ${isRefreshing ? 'animate-spin' : ''}`}
            disabled={isRefreshing}
            aria-label="Refresh events data"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>
      
      <div className="mb-4">
        <button
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          className={`flex items-center px-3 py-2 rounded-lg ${theme === 'light' ? 'bg-gray-100 hover:bg-gray-200' : 'bg-gray-700 hover:bg-gray-600'} transition-colors`}
        >
          <Filter size={16} className="mr-2" />
          <span>Filter Categories</span>
          {isFiltersOpen ? <ChevronUp size={16} className="ml-2" /> : <ChevronDown size={16} className="ml-2" />}
        </button>
        
        {isFiltersOpen && (
          <div className="mt-3 flex flex-wrap gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => toggleCategory(category.id)}
                className={`px-3 py-1.5 rounded-full flex items-center transition-colors ${
                  selectedCategories.includes(category.id) 
                    ? 'bg-blue-500 text-white' 
                    : `${theme === 'light' ? 'bg-white border border-gray-300' : 'bg-gray-600 border border-gray-500'}`
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${category.color} mr-2`}></div>
                <span>{category.name}</span>
              </button>
            ))}
            {selectedCategories.length > 0 && (
              <button
                onClick={() => setSelectedCategories([])}
                className="px-3 py-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                Clear all
              </button>
            )}
          </div>
        )}
      </div>
      
      {filteredEvents.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
          <Calendar size={32} className="mx-auto text-gray-400 mb-2" />
          <p className="text-gray-500 dark:text-gray-400">No events found for the selected filters</p>
          {selectedCategories.length > 0 && (
            <button
              onClick={() => setSelectedCategories([])}
              className="mt-2 px-4 py-2 text-blue-500 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEvents.map(event => (
            <div
              key={event.id}
              className={`p-4 rounded-lg ${theme === 'light' ? 'bg-gray-50 hover:bg-gray-100' : 'bg-gray-700 hover:bg-gray-600'} transition-all duration-300 border-l-4 ${getCategoryColor(event.category)}`}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{event.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mt-1">{event.description}</p>
                  <div className="flex flex-wrap items-center mt-2 gap-x-4 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-1" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock size={14} className="mr-1" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin size={14} className="mr-1" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Tag size={14} className="mr-1" />
                      <span className="capitalize">{event.category}</span>
                    </div>
                  </div>
                </div>
                {event.imageUrl && (
                  <div className="w-full md:w-32 h-24 md:h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <img 
                      src={event.imageUrl} 
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default EventsSection;