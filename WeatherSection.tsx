import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, CloudSnow, Wind, Thermometer, Droplets, Sunrise, Sunset, RefreshCw } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import type { City } from '../context/CityContext';
import { getMockWeatherData } from '../services/mockWeatherService';

interface WeatherInfo {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
  sunrise: string;
  sunset: string;
  forecast: {
    day: string;
    condition: string;
    tempHigh: number;
    tempLow: number;
  }[];
}

interface WeatherSectionProps {
  city: City;
}

const WeatherSection: React.FC<WeatherSectionProps> = ({ city }) => {
  const { theme } = useTheme();
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchWeather();
  }, [city]);

  const fetchWeather = async () => {
    setLoading(true);
    try {
      // In a real app, we would fetch from a real API using the city coordinates
      // For now, we'll use mock data
      const weatherData = getMockWeatherData(city.id);
      setWeather(weatherData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching weather data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshWeather = async () => {
    setIsRefreshing(true);
    await fetchWeather();
    setTimeout(() => setIsRefreshing(false), 600); // Show refresh animation for at least 600ms
  };

  const getWeatherIcon = (condition: string, size = 24) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
        return <Sun size={size} className="text-yellow-400" />;
      case 'cloudy':
        return <Cloud size={size} className="text-gray-400" />;
      case 'rainy':
        return <CloudRain size={size} className="text-blue-400" />;
      case 'snowy':
        return <CloudSnow size={size} className="text-blue-200" />;
      case 'windy':
        return <Wind size={size} className="text-gray-500" />;
      default:
        return <Sun size={size} className="text-yellow-400" />;
    }
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  if (loading && !weather) {
    return (
      <section id="weather" className={`p-6 rounded-xl shadow-md ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </section>
    );
  }

  if (!weather) {
    return (
      <section id="weather" className={`p-6 rounded-xl shadow-md ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
        <div className="text-center py-8">
          <p>Unable to load weather data. Please try again later.</p>
          <button 
            onClick={refreshWeather} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center mx-auto"
          >
            <RefreshCw size={16} className="mr-2" />
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="weather" className={`p-6 rounded-xl shadow-md overflow-hidden ${theme === 'light' ? 'bg-white' : 'bg-gray-800'} transition-all duration-300`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Weather</h2>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <span>Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          <button 
            onClick={refreshWeather} 
            className={`ml-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all ${isRefreshing ? 'animate-spin' : ''}`}
            disabled={isRefreshing}
            aria-label="Refresh weather data"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>
      
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="mr-4 transform transition-transform duration-700 hover:scale-110">
            {getWeatherIcon(weather.condition, 64)}
          </div>
          <div>
            <div className="text-4xl font-semibold">{weather.temperature}°C</div>
            <div className="text-gray-500 dark:text-gray-400 capitalize">{weather.condition}</div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className={`p-3 rounded-lg ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-700'} flex items-center`}>
            <Thermometer size={20} className="text-orange-500 mr-2" />
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Feels like</div>
              <div className="font-medium">{weather.feelsLike}°C</div>
            </div>
          </div>
          <div className={`p-3 rounded-lg ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-700'} flex items-center`}>
            <Droplets size={20} className="text-blue-500 mr-2" />
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Humidity</div>
              <div className="font-medium">{weather.humidity}%</div>
            </div>
          </div>
          <div className={`p-3 rounded-lg ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-700'} flex items-center`}>
            <Wind size={20} className="text-teal-500 mr-2" />
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Wind</div>
              <div className="font-medium">{weather.windSpeed} km/h</div>
            </div>
          </div>
          <div className={`p-3 rounded-lg ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-700'} flex items-center space-x-2`}>
            <div className="flex flex-col items-center">
              <Sunrise size={18} className="text-orange-400" />
              <div className="text-xs mt-1">{formatTime(weather.sunrise)}</div>
            </div>
            <div className="text-gray-300 dark:text-gray-600">|</div>
            <div className="flex flex-col items-center">
              <Sunset size={18} className="text-orange-600" />
              <div className="text-xs mt-1">{formatTime(weather.sunset)}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="overflow-auto">
        <h3 className="text-lg font-medium mb-3">5-Day Forecast</h3>
        <div className="flex space-x-4 pb-2">
          {weather.forecast.map((day, index) => (
            <div 
              key={index} 
              className={`min-w-[100px] p-3 rounded-lg ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-700'} flex flex-col items-center transition-transform duration-300 hover:transform hover:translate-y-[-4px]`}
            >
              <div className="font-medium mb-2">{day.day}</div>
              {getWeatherIcon(day.condition)}
              <div className="mt-2 text-sm">
                <span className="font-medium">{day.tempHigh}°</span>
                <span className="mx-1 text-gray-400">|</span>
                <span className="text-gray-500 dark:text-gray-400">{day.tempLow}°</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WeatherSection;