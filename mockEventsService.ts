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

const eventTitles = [
  'Summer Music Festival',
  'Local Farmers Market',
  'International Food Fair',
  'Tech Conference 2025',
  'Art Gallery Opening',
  'Marathon Run for Charity',
  'Community Cleanup Day',
  'Basketball Championship',
  'Theater Production: Romeo & Juliet',
  'Wine Tasting Event'
];

const eventLocations = [
  'Central Park',
  'Convention Center',
  'City Hall Plaza',
  'Downtown Theater',
  'Sports Stadium',
  'Community Center',
  'Riverside Park',
  'Museum of Fine Arts',
  'Public Library',
  'Beachfront Pavilion'
];

const eventDescriptions = [
  'Join us for a day of fun and entertainment with live music, food stalls, and activities for the whole family.',
  'Explore the best local produce and handcrafted goods from vendors across the region.',
  'Expand your culinary horizons with dishes from around the world at this international food celebration.',
  'Learn from industry experts and network with professionals at this cutting-edge technology event.',
  'Be the first to see this stunning collection of contemporary art from both established and emerging artists.',
  'Participate or cheer on runners in this annual marathon that raises funds for local charities.',
  'Help make our city cleaner and greener by joining fellow community members in this environmental initiative.',
  'Don\'t miss the nail-biting action as top teams compete for the championship title.',
  'Experience the classic tale of star-crossed lovers in this modern interpretation of Shakespeare\'s masterpiece.',
  'Sample a selection of fine wines paired with gourmet appetizers at this sophisticated tasting event.'
];

const eventCategories: ('music' | 'sports' | 'arts' | 'food' | 'community')[] = [
  'music', 'sports', 'arts', 'food', 'community'
];

const mockImages = [
  'https://images.pexels.com/photos/2263436/pexels-photo-2263436.jpeg',
  'https://images.pexels.com/photos/976866/pexels-photo-976866.jpeg',
  'https://images.pexels.com/photos/787961/pexels-photo-787961.jpeg',
  'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg',
  'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg'
];

// Generate semi-random but consistent events data based on city ID
export const getMockEventsData = (cityId: string): Event[] => {
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
  
  // Generate random dates for the next month
  const getRandomDate = (offset = 0) => {
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + getRandomNumber(1, 30, offset));
    return futureDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  const getRandomTime = (offset = 0) => {
    const hour = getRandomNumber(9, 21, offset);
    const minute = getRandomNumber(0, 4, offset * 10) * 15;
    return `${hour}:${minute === 0 ? '00' : minute} ${hour >= 12 ? 'PM' : 'AM'}`;
  };
  
  // Create events
  const eventCount = getRandomNumber(5, 10);
  const events: Event[] = [];
  
  for (let i = 0; i < eventCount; i++) {
    events.push({
      id: `event-${i}-${cityId}`,
      title: getRandomItem(eventTitles, i * 10),
      date: getRandomDate(i * 5),
      time: getRandomTime(i * 3),
      location: getRandomItem(eventLocations, i * 7),
      category: getRandomItem(eventCategories, i * 11),
      description: getRandomItem(eventDescriptions, i * 13),
      imageUrl: i % 2 === 0 ? getRandomItem(mockImages, i * 17) : undefined
    });
  }
  
  return events;
};