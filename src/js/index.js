import "../style.css";
import { WeatherAPI } from "./weatherApi.js";
import { WeatherUI } from "./ui/weatherUI.js";

class WeatherApp {
  constructor(){
    this.weatherApi = new WeatherAPI(this);
    this.ui = new WeatherUI(this);
  }
  init(){
    console.log("Starting weather app")
    this.ui.init();
  }
}

window.weatherApp =  new WeatherApp();
weatherApp.init();