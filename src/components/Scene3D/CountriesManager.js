import Countries from './data/data-countries'

class CountriesManager {
  constructor () {
    this.mapColorCountries = {}
  }
  init () {
    Countries.forEach(((country, i) => {
      const c = country.color.substr(1);
      
      let name = `${c[0]}${c[0]}${c[1]}${c[1]}${c[2]}${c[2]}`.toUpperCase(); // a bit hardcore but translate color #123 to 112233 for the country id
      this.mapColorCountries[name] = { ...country, id: i };
    }));
  }

  getCountry(color) {
    return this.mapColorCountries[color]
  }
}

export default new CountriesManager()