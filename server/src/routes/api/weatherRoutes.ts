import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {
  const { cityName } = req.body; // Change from "city" to "cityName"
  if (!cityName) {
    return res.status(400).json({ error: 'City name is required' });
  }

  try {
    const weatherData = await WeatherService.getWeatherForCity(cityName); // Use cityName here
    return res.json(weatherData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
  try {
    const cities = await HistoryService.getCities();
    return res.status(200).json(cities);
  } catch (error: unknown) {
    console.error('Error fetching search history:', error);
    return res.status(500).json({ error: 'Failed to retrieve search history' });
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
      return res.status(200).json({ message: 'City removed from history' });
    } else {
      return res.status(404).json({ error: 'City not found' });
    }
  } catch (error: unknown) {
    console.error('Error removing city from history:', error);
    return res.status(500).json({ error: 'Failed to remove city from history' });
  }
});

export default router;
