import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// TODO: Define a class for the Weather object
class Weather {
  constructor(
    public city: string,
    public country: string,
    public currentTemp: number,
    public currentWeather: string,
    public forecast: Array<{ date: string; temp: number; weather: string }>
  ) {}
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL: string;
  private apiKey: string;
  private cityName: string;
  constructor() {
    this.baseURL = 'https://api.openweathermap.org/data/2.5';
    this.apiKey = process.env.API_KEY || '';
    this.cityName = '';
  }
  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string) {
    const url = `${this.baseURL}/weather?q=${query}&appid=${this.apiKey}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error fetching location data: ${response.statusText}`);
      }
      const data: Coordinates[] = await response.json();
      if (data.length === 0) {
        throw new Error('No location found for the given query');
      }
      return data[0];
    } catch (error) {
      console.error('Error fetching location data:', error);
      throw error;
    }
  }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    if (!locationData || typeof locationData.lat !== 'number' || typeof locationData.lon !== 'number') {
      throw new Error('Invalid location data');
    }
    return {
      lat: locationData.lat,
      lon: locationData.lon
    };
  }

  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=metric`;
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData() {
    const locationData = await this.fetchLocationData(this.cityName);
    return this.destructureLocationData(locationData);
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    const weatherQuery = this.buildWeatherQuery(coordinates);
    try {
      const response = await fetch(weatherQuery);
      if (!response.ok) {
        throw new Error(`Error fetching weather data: ${response.statusText}`);
      }
      const weatherData = await response.json();
      return weatherData;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
    if (!response || !response.list || !Array.isArray(response.list) || response.list.length === 0) {
      throw new Error('Invalid weather data received');
    }
  
    const currentData = response.list[0];
    const { name: city, country } = response.city;
    const { temp: currentTemp } = currentData.main;
    const currentWeather = currentData.weather[0].description;
  
    return new Weather(city, country, currentTemp, currentWeather, []);
  }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any) {
    if (!weatherData || !weatherData.list || !Array.isArray(weatherData.list) || weatherData.list.length === 0) {
      throw new Error('Invalid weather data for forecast');
    }
  
    const forecast = weatherData.list.map((data: any) => ({
      date: data.dt_txt,
      temp: data.main.temp,
      weather: data.weather[0].description
    }));
  
    currentWeather.forecast = forecast;
    return currentWeather;
  }
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    if (!city || typeof city !== 'string') {
      throw new Error('City name must be a valid string');
    }
    this.cityName = city;
    try {
      const coordinates = await this.fetchAndDestructureLocationData();
      const weatherData = await this.fetchWeatherData(coordinates);
      const currentWeather = this.parseCurrentWeather(weatherData);
      return this.buildForecastArray(currentWeather, weatherData);
    } catch (error) {
      console.error('Error getting weather for city:', error);
      throw error;
    }
  }
}

export default new WeatherService();
