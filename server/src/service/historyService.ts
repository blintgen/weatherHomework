import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
// TODO: Define a City class with name and id properties
class City {
  constructor(public name: string, public id: string = uuidv4()) {}
}

// TODO: Complete the HistoryService class
class HistoryService {
  // TODO: Define a read method that reads from the searchHistory.json file
  private async read() {
    const filePath = path.join('/home/boa/Bootcamp/09-Servers-and-APIs/02-Challenge/Develop/server/db/db.json');
    try {
      const data = await fs.readFile(filePath, 'utf-8');
      return data ? JSON.parse(data) as City[] : [];
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return [];
      }
      console.error('Error reading file:', error);
      throw error;
    }
  }
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]) {
    const filePath = path.join('/home/boa/Bootcamp/09-Servers-and-APIs/02-Challenge/Develop/server/db/db.json');
    try {
      await fs.writeFile(filePath, JSON.stringify(cities, null, 2), 'utf-8');
    } catch (error) {
      console.error('Error writing to file:', error);
      throw error;
    }
  }
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities() {
    try {
      const cities = await this.read();
      return cities.map(city => new City(city.name, city.id));
    } catch (error) {
      console.error('Error reading cities:', error);
      throw error;
    }
  }
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city: string) {
    try {
      const cities = await this.read();
      const newCity = new City(city);
      cities.push(newCity);
      await this.write(cities);
      return newCity;
    } catch (error) {
      console.error('Error adding city:', error);
      throw error;
    }
  }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string) {
    try {
      const cities = await this.read();
      const updatedCities = cities.filter(city => city.id !== id);
      if (updatedCities.length === cities.length) {
        throw new Error('City not found');
      }
      await this.write(updatedCities);
      return true;
    } catch (error) {
      console.error('Error removing city:', error);
      throw error;
    }
  }
}

export default new HistoryService();
