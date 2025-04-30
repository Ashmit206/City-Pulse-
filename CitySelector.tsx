import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Heart, X } from 'lucide-react';
import { useCity, City } from '../context/CityContext';
import { useTheme } from '../context/ThemeContext';

const CitySelector: React.FC = () => {
  const { currentCity, cities, favoriteIds, setCurrentCity, toggleFavorite, searchCities } = useCity();
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<City[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Handle outside click to close search results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Update search results when query changes
  useEffect(() => {
    if (searchQuery.trim()) {
      setSearchResults(searchCities(searchQuery));
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, searchCities]);

  const handleCitySelect = (city: City) => {
    setCurrentCity(city);
    setSearchQuery('');
    setSearchResults([]);
    setIsSearchFocused(false);
  };

  const getFavorites = () => {
    return cities.filter(city => favoriteIds.includes(city.id));
  };

  return (
    <div className={`mb-8 ${theme === 'light' ? 'bg-white' : 'bg-gray-800'} rounded-xl shadow-md p-4 md:p-6`}>
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <h2 className="text-xl font-semibold flex items-center">
          <MapPin className="mr-2 text-blue-500" size={20} />
          {currentCity.name}, {currentCity.country}
        </h2>
        
        <div className="relative" ref={searchRef}>
          <div className={`flex items-center border ${isSearchFocused ? 'border-blue-500 ring-2 ring-blue-100 dark:ring-blue-900/30' : 'border-gray-300 dark:border-gray-600'} ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-700'} rounded-lg px-3 py-2 transition-all duration-200`}>
            <Search size={18} className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search cities..."
              className="flex-1 outline-none bg-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>
          
          {/* Search Results */}
          {isSearchFocused && (
            <div className={`absolute z-10 mt-2 w-full ${theme === 'light' ? 'bg-white' : 'bg-gray-800'} border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden`}>
              {searchResults.length > 0 ? (
                <ul>
                  {searchResults.map(city => (
                    <li 
                      key={city.id} 
                      className="border-b border-gray-100 dark:border-gray-700 last:border-0"
                    >
                      <button
                        className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => handleCitySelect(city)}
                      >
                        <div className="flex items-center">
                          <MapPin size={16} className="text-gray-400 mr-2" />
                          <span>{city.name}, {city.country}</span>
                        </div>
                        <Heart 
                          size={16} 
                          className={favoriteIds.includes(city.id) ? 'text-red-500 fill-red-500' : 'text-gray-300 dark:text-gray-600'}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(city.id);
                          }}
                        />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : searchQuery ? (
                <div className="px-4 py-3 text-sm text-gray-500">No cities found</div>
              ) : (
                <div className="px-4 py-3 text-sm text-gray-500">Type to search for a city</div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Favorites */}
      {getFavorites().length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Your cities</h3>
          <div className="flex flex-wrap gap-2">
            {getFavorites().map(city => (
              <button
                key={city.id}
                onClick={() => handleCitySelect(city)}
                className={`px-3 py-1.5 rounded-full flex items-center transition-colors ${
                  currentCity.id === city.id 
                    ? 'bg-blue-500 text-white' 
                    : `${theme === 'light' ? 'bg-gray-100 hover:bg-gray-200' : 'bg-gray-700 hover:bg-gray-600'}`
                }`}
              >
                <span className="mr-1">{city.name}</span>
                <Heart 
                  size={14} 
                  className={`fill-current ${currentCity.id === city.id ? 'text-white' : 'text-red-500'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(city.id);
                  }}
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CitySelector;