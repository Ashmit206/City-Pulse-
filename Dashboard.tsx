import React from 'react';
import WeatherSection from './WeatherSection';
import TrafficSection from './TrafficSection';
import EventsSection from './EventsSection';
import { useCity } from '../context/CityContext';

const Dashboard: React.FC = () => {
  const { currentCity } = useCity();

  return (
    <div className="grid gap-8">
      <WeatherSection city={currentCity} />
      <TrafficSection city={currentCity} />
      <EventsSection city={currentCity} />
    </div>
  );
};

export default Dashboard;