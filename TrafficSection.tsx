import React, { useState, useEffect } from 'react';
import { Car, AlertTriangle, Clock, MapPin, Loader as Road, Navigation, RefreshCw } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import type { City } from '../context/CityContext';
import { getMockTrafficData } from '../services/mockTrafficService';

interface TrafficIncident {
  id: string;
  type: 'accident' | 'construction' | 'closure' | 'congestion';
  location: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  estimatedClearTime: string;
}

interface TrafficData {
  congestionLevel: number; // 0-100
  incidents: TrafficIncident[];
  mainRoutes: {
    name: string;
    status: 'clear' | 'moderate' | 'heavy';
    travelTime: number; // in minutes
  }[];
}

interface TrafficSectionProps {
  city: City;
}

const TrafficSection: React.FC<TrafficSectionProps> = ({ city }) => {
  const { theme } = useTheme();
  const [traffic, setTraffic] = useState<TrafficData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchTraffic();
  }, [city]);

  const fetchTraffic = async () => {
    setLoading(true);
    try {
      // In a real app, we would fetch from a real API using the city coordinates
      // For now, we'll use mock data
      const trafficData = getMockTrafficData(city.id);
      setTraffic(trafficData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching traffic data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshTraffic = async () => {
    setIsRefreshing(true);
    await fetchTraffic();
    setTimeout(() => setIsRefreshing(false), 600); // Show refresh animation for at least 600ms
  };

  const getSeverityColor = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'low':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'medium':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getRouteStatusColor = (status: 'clear' | 'moderate' | 'heavy') => {
    switch (status) {
      case 'clear':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'heavy':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getIncidentIcon = (type: 'accident' | 'construction' | 'closure' | 'congestion') => {
    switch (type) {
      case 'accident':
        return <AlertTriangle size={16} className="text-red-500" />;
      case 'construction':
        return <Road size={16} className="text-orange-500" />;
      case 'closure':
        return <AlertTriangle size={16} className="text-red-500" />;
      case 'congestion':
        return <Car size={16} className="text-yellow-500" />;
      default:
        return <AlertTriangle size={16} />;
    }
  };

  if (loading && !traffic) {
    return (
      <section id="traffic" className={`p-6 rounded-xl shadow-md ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="grid gap-4">
            <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </section>
    );
  }

  if (!traffic) {
    return (
      <section id="traffic" className={`p-6 rounded-xl shadow-md ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
        <div className="text-center py-8">
          <p>Unable to load traffic data. Please try again later.</p>
          <button 
            onClick={refreshTraffic} 
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
    <section id="traffic" className={`p-6 rounded-xl shadow-md ${theme === 'light' ? 'bg-white' : 'bg-gray-800'} transition-all duration-300`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Traffic</h2>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <span>Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          <button 
            onClick={refreshTraffic} 
            className={`ml-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all ${isRefreshing ? 'animate-spin' : ''}`}
            disabled={isRefreshing}
            aria-label="Refresh traffic data"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>
      
      <div className="mb-8">
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Car className="mr-2 text-blue-500" size={20} />
              <h3 className="font-medium">Overall Traffic Conditions</h3>
            </div>
            <div className="text-sm">
              <span className={`px-2 py-1 rounded-full font-medium ${
                traffic.congestionLevel < 30 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                  : traffic.congestionLevel < 70 
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' 
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              }`}>
                {traffic.congestionLevel < 30 
                  ? 'Light' 
                  : traffic.congestionLevel < 70 
                    ? 'Moderate' 
                    : 'Heavy'}
              </span>
            </div>
          </div>
          
          <div className="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${
                traffic.congestionLevel < 30 
                  ? 'bg-green-500' 
                  : traffic.congestionLevel < 70 
                    ? 'bg-yellow-500' 
                    : 'bg-red-500'
              }`} 
              style={{ width: `${traffic.congestionLevel}%` }}
            ></div>
          </div>
        </div>
        
        <h3 className="font-medium mb-3">Main Routes</h3>
        <div className="grid gap-2">
          {traffic.mainRoutes.map((route, index) => (
            <div 
              key={index} 
              className={`p-3 rounded-lg ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-700'} flex justify-between items-center`}
            >
              <div className="flex items-center">
                <Navigation size={16} className="text-blue-500 mr-2" />
                <span>{route.name}</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center">
                  <Clock size={16} className="text-gray-400 mr-1" />
                  <span>{route.travelTime} min</span>
                </div>
                <span className={`px-2 py-0.5 text-xs rounded-full ${getRouteStatusColor(route.status)}`}>
                  {route.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {traffic.incidents.length > 0 && (
        <div>
          <h3 className="font-medium mb-3">Current Incidents</h3>
          <div className="space-y-3">
            {traffic.incidents.map(incident => (
              <div 
                key={incident.id} 
                className={`p-4 rounded-lg ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-700'} border-l-4 ${
                  incident.severity === 'high' 
                    ? 'border-red-500' 
                    : incident.severity === 'medium' 
                      ? 'border-orange-500' 
                      : 'border-yellow-500'
                }`}
              >
                <div className="flex items-start">
                  <div className="mr-3 mt-0.5">
                    {getIncidentIcon(incident.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="font-medium capitalize">{incident.type}</div>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${getSeverityColor(incident.severity)}`}>
                        {incident.severity}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{incident.description}</p>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-2 space-x-3">
                      <div className="flex items-center">
                        <MapPin size={12} className="mr-1" />
                        <span>{incident.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock size={12} className="mr-1" />
                        <span>Clear by {incident.estimatedClearTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default TrafficSection;