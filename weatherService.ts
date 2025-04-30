import axios from 'axios';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export interface WeatherData {
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

export const getWeatherData = async (lat: number, lon: number): Promise<WeatherData> => {
  try {
    const [currentWeather, forecast] = await Promise.all([
      axios.get(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`),
      axios.get(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`)
    ]);

    const processedForecast = processForecastData(forecast.data.list);

    return {
      temperature: Math.round(currentWeather.data.main.temp),
      condition: currentWeather.data.weather[0].main.toLowerCase(),
      humidity: currentWeather.data.main.humidity,
      windSpeed: Math.round(currentWeather.data.wind.speed * 3.6), // Convert m/s to km/h
      feelsLike: Math.round(currentWeather.data.main.feels_like),
      sunrise: new Date(currentWeather.data.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sunset: new Date(currentWeather.data.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      forecast: processedForecast
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

const processForecastData = (forecastList: any[]) => {
  const dailyForecasts = forecastList.reduce((acc: any[], item: any) => {
    const date = new Date(item.dt * 1000);
    const day = date.toLocaleDateString('en-US', { weekday: 'short' });
    
    if (!acc.find(forecast => forecast.day === day)) {
      acc.push({
        day,
        condition: item.weather[0].main.toLowerCase(),
        tempHigh: Math.round(item.main.temp_max),
        tempLow: Math.round(item.main.temp_min)
      });
    }
    return acc;
  }, []).slice(0, 5);

  return dailyForecasts;
};