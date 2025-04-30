import React, { createContext, useState, useContext, ReactNode } from 'react';
import { defaultCities } from '../data/cityData';

export interface City {
  id: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  isFavorite?: boolean;
}

interface CityContextType {
  currentCity: City;
  cities: City[];
  favoriteIds: string[];
  setCurrentCity: (city: City) => void;
  toggleFavorite: (cityId: string) => void;
  searchCities: (query: string) => City[];
}

const CityContext = createContext<CityContextType | undefined>(undefined);

export const CityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cities] = useState<City[]>(defaultCities);
  const [currentCity, setCurrentCity] = useState<City>(defaultCities[0]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([defaultCities[0].id]);

  const toggleFavorite = (cityId: string) => {
    setFavoriteIds(prev => 
      prev.includes(cityId) 
        ? prev.filter(id => id !== cityId) 
        : [...prev, cityId]
    );
  };

  const searchCities = (query: string): City[] => {
    if (!query.trim()) return [];
    
    const lowerQuery = query.toLowerCase().trim();
    return cities.filter(city => 
      city.name.toLowerCase().includes(lowerQuery) || 
      city.country.toLowerCase().includes(lowerQuery)
    ).slice(0, 5);
  };

  return (
    <CityContext.Provider value={{
      currentCity,
      cities,
      favoriteIds,
      setCurrentCity,
      toggleFavorite,
      searchCities
    }}>
      {children}
    </CityContext.Provider>
  );
};

export const useCity = (): CityContextType => {
  const context = useContext(CityContext);
  if (context === undefined) {
    throw new Error('useCity must be used within a CityProvider');
  }
  return context;
};