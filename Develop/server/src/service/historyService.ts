import fs from 'node:fs/promises'

// TODO: Define a City class with name and id properties
class City {
  id: number
  name: string

  constructor(id: number, name: string) {
    this.id = id
    this.name = name;
  }
}

// TODO: Complete the HistoryService class
class HistoryService {
  // TODO: Define a read method that reads from the searchHistory.json file
  private async read(): Promise<City> {
    try {
      return JSON.parse(
        await fs.readFile('searchHistory.json', 'utf-8')
      )
    } 
    catch (err) {
      throw err
    }
    
  }

  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]): Promise<void> {
    try {
      await fs.writeFile('searchHistory.json', JSON.stringify(cities, null, 2))
    } 
    catch (err) {
      throw err
    }
  }

  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities(): Promise<City[]> {
    try {
      const citiesArr = JSON.parse(await fs.readFile('searchHistory.json', 'utf-8'))

      return citiesArr.map((city: City)  => new City(city.id, city.name))
    }
    catch (err) {
      throw err
    }
  }
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(cityName: string) {
    try {
      const cities = await this.getCities()

      if (cities.some(city => city.name.toLowerCase() === city.name.toLowerCase())) {
        return
      }


      cities.push(new City(this.getCities.length > 0 ? cities[this.getCities.length - 1].id + 1 : 1, cityName))
    
      await this.write(cities)
    }
    catch (err) {
      throw err
    }
  }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: number) {
    try {
      let cities = await this.getCities()

      const updatedCities = cities.filter(city => city.id !== id)

      if (cities.length === updatedCities.length) {
        return
      }

      await this.write(updatedCities)
    }
    catch (err) {
      throw err
    }
  }
}

export default new HistoryService();
