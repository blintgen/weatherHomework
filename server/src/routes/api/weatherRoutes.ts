import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', (req: Request, res: Response) => {
  // TODO: GET weather data from city name
  const { city } = req.body;
  if (!city) {
    res.status(400).json({ error: 'City name is required' });
  }
  WeatherService.getWeatherForCity(city)
    .then((weatherData) => {
      res.status(200).json(weatherData);
    })
    .catch((error: unknown) => {
      console.error('Error fetching weather data:', error);
      res.status(500).json({ error: 'Failed to retrieve weather data' });
    });
  // TODO: save city to search history
  HistoryService.addCity(city)
    .then(() => {
      console.log(`City ${city} saved to history.`);
    })
    .catch((error: unknown) => {
      console.error('Error saving city to history:', error);
    });
});

// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
  try {
    const cities = await HistoryService.getCities();
    res.status(200).json(cities);
  } catch (error: unknown) {
    console.error('Error fetching search history:', error);
    res.status(500).json({ error: 'Failed to retrieve search history' });
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ error: 'City ID is required' });
  }
  try {
    const success = await HistoryService.removeCity(id);
    if (success) {
      res.status(200).json({ message: 'City removed from history' });
    } else {
      res.status(404).json({ error: 'City not found' });
    }
  } catch (error: unknown) {
    console.error('Error removing city from history:', error);
    res.status(500).json({ error: 'Failed to remove city from history' });
  }
});

export default router;
