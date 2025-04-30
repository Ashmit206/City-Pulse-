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

const incidentTypes: ('accident' | 'construction' | 'closure' | 'congestion')[] = ['accident', 'construction', 'closure', 'congestion'];
const severityLevels: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];
const statusLevels: ('clear' | 'moderate' | 'heavy')[] = ['clear', 'moderate', 'heavy'];

// Generate semi-random but consistent traffic data based on city ID
export const getMockTrafficData = (cityId: string): TrafficData => {
  // Use cityId as a seed for "randomness" to get consistent results for the same city
  const seed = cityId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Generate a random number between min and max based on the seed
  const getRandomNumber = (min: number, max: number, offset = 0) => {
    const randomValue = (seed + offset) % (max - min);
    return min + randomValue;
  };
  
  // Get a random item from an array based on the seed
  const getRandomItem = <T>(arr: T[], offset = 0): T => {
    return arr[(seed + offset) % arr.length];
  };
  
  const congestionLevel = getRandomNumber(10, 90);
  
  // Create incidents
  const incidentCount = getRandomNumber(0, 5);
  const incidents: TrafficIncident[] = [];
  
  for (let i = 0; i < incidentCount; i++) {
    incidents.push({
      id: `incident-${i}-${cityId}`,
      type: getRandomItem(incidentTypes, i * 10),
      location: `${getRandomItem(['Main St', 'Broadway', 'Fifth Ave', 'Park Rd', 'River St'], i * 5)} & ${getRandomItem(['1st', '2nd', '3rd', '4th', '5th'], i * 7)} Ave`,
      description: getRandomItem([
        'Multiple vehicles involved. Right lane blocked.',
        'Road work in progress. Expect delays.',
        'Road closed due to police activity.',
        'Heavy traffic due to events in the area.',
        'Lane closure due to gas line repair.'
      ], i * 15),
      severity: getRandomItem(severityLevels, i * 3),
      estimatedClearTime: `${getRandomNumber(1, 12)}:${getRandomNumber(0, 6)}${getRandomNumber(0, 10)} ${getRandomItem(['AM', 'PM'])}`
    });
  }
  
  // Create main routes
  const routeNames = [
    `Downtown to ${getRandomItem(['Airport', 'Uptown', 'East Side', 'West End', 'North Hills'], 20)}`,
    `${getRandomItem(['South Park', 'University', 'Riverview', 'Highland', 'Metro Center'], 30)} to Downtown`,
    `${getRandomItem(['Highway', 'Interstate', 'Route'], 40)} ${getRandomNumber(1, 99, 50)}`,
    `${getRandomItem(['Bridge', 'Tunnel', 'Causeway'], 60)} ${getRandomItem(['North', 'South', 'East', 'West'], 70)}`
  ];
  
  const mainRoutes = routeNames.map((name, index) => ({
    name,
    status: getRandomItem(statusLevels, index * 10),
    travelTime: getRandomNumber(10, 45, index * 5)
  }));
  
  return {
    congestionLevel,
    incidents,
    mainRoutes
  };
};