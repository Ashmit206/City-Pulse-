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

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const conditions = ['sunny', 'cloudy', 'rainy', 'windy', 'snowy'];

// Generate semi-random but consistent weather data based on city ID
export const getMockWeatherData = (cityId: string): WeatherInfo => {
  // Use cityId as a seed for "randomness" to get consistent results for the same city
  const seed = cityId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Generate a random number between min and max based on the seed
  const getRandomNumber = (min: number, max: number, offset = 0) => {
    const randomValue = (seed + offset) % (max - min);
    return min + randomValue;
  };
  
  // Get a random item from an array based on the seed
  const getRandomItem = (arr: string[], offset = 0) => {
    return arr[(seed + offset) % arr.length];
  };
  
  const temperature = getRandomNumber(15, 30);
  const condition = getRandomItem(conditions);
  
  // Generate semi-random forecast
  const forecast = days.map((day, index) => {
    const randomCondition = getRandomItem(conditions, index * 10);
    const tempHigh = temperature + getRandomNumber(-5, 5, index);
    const tempLow = tempHigh - getRandomNumber(5, 10, index);
    
    return {
      day,
      condition: randomCondition,
      tempHigh: Math.round(tempHigh),
      tempLow: Math.round(tempLow),
    };
  });
  
  return {
    temperature: Math.round(temperature),
    condition,
    humidity: getRandomNumber(30, 90),
    windSpeed: getRandomNumber(5, 25),
    feelsLike: Math.round(temperature + getRandomNumber(-3, 3)),
    sunrise: '6:42 AM',
    sunset: '7:15 PM',
    forecast,
  };
};