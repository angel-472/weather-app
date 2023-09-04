import "../style.css";
import { WeatherAPI } from "./weatherApi.js";

class WeatherApp {
  constructor(){
    this.weatherApi = new WeatherAPI(this);
  }
  init(){
    console.log("Starting weather app")
  }
}

window.weatherApp =  new WeatherApp();
weatherApp.init();