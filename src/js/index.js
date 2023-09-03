import { WeatherAPI } from "./weatherApi.js";

class WeatherApp {
  constructor(){
    this.weatherApi = new WeatherAPI(this);
  }
}

window.weatherApp =  new WeatherApp();