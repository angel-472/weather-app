export class WeatherAPI {
  constructor(app){
    this.app = app;
    this.apiKey = 'dc972c4bd87a4309b88162144232008';
    this.locationQuery = 'Manhattan, New York';
  }
  setLocationQuery(locationString){
    this.locationQuery = locationString;
  }
  async getWeatherForecast(){
    if(this.locationQuery == undefined){
      console.error(`Can't request weather without a location query!`);
      return;
    }
    let apiRequest = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${this.apiKey}&q=${this.locationQuery}&days=3&aqi=yes&alerts=yes`, {mode: 'cors'});
    let responseJson = await apiRequest.json();
    return responseJson;
  }
}