import { getDay, parseISO, format } from "date-fns";

export class WeatherUI {
  constructor(app){
    this.app = app;
    this.errorMessageBox = document.getElementById('error-message');
    this.weatherData;
    this.tempUnit = "f";
    this.windUnit = "mph";
  }
  init(){
    let searchTextInput = document.getElementById('search-box');
    let searchSubmitButton = document.getElementById('search-submit');
    searchSubmitButton.addEventListener('click', (e) => {
      e.preventDefault();
      this.hideErrorMessage();
      let query = searchTextInput.value;
      if(query == ""){
        return;
      }
      this.app.weatherApi.locationQuery = query;
      let forecastResponse = this.app.weatherApi.getWeatherForecast();
      forecastResponse.then((data) => {
        console.log("Search Completed!");
        console.log(data);
        if(data.error !== undefined){
          this.showErrorMessage(data.error.message);
        }
        else if(data.location !== undefined) {
          this.updateWeatherDisplay(data);
        }
      })
    });

    let forecastResponse = this.app.weatherApi.getWeatherForecast();
    forecastResponse.then((data) => {
      this.updateWeatherDisplay(data);
    })
  }
  showErrorMessage(message){
    this.errorMessageBox.style.display = 'block';
    this.errorMessageBox.textContent = message;
  }
  hideErrorMessage(){
    this.errorMessageBox.style.display = 'none';
  }
  updateWeatherDisplay(data){
    this.weatherData = data;
    this.updateBackground();
    this.updateMainCard();
    this.updateFeelsLike();
    this.updateUVIndex();
    this.updateHumidity();
    this.updateWindSpeed();
    this.updateSunriseSunset();
    this.updateMoonPhase();
    this.updateForecast();
  }
  updateMainCard(){
    document.getElementById("location").textContent = `${this.weatherData.location.name}, ${this.weatherData.location.region}`
    let temperature = `${Math.round(this.weatherData.current[`temp_${this.tempUnit}`])}°${this.tempUnit.toUpperCase()}`
    document.getElementById("temperature").textContent = temperature;
    document.getElementById("condition").textContent = this.weatherData.current.condition.text;
  }
  updateFeelsLike(){
    let feelsLikeElement = document.getElementById("feels-like");
    let feelsLikeValue = this.weatherData.current[`feelslike_${this.tempUnit}`];
    let temperature = Math.round(this.weatherData.current[`temp_${this.tempUnit}`]);
    let weatherCardComment = document.querySelector("#feels-like + .weather-card-comment");
    if(feelsLikeValue > temperature){
      weatherCardComment.textContent = "Temperature feels warmer.";
    }
    else {
      weatherCardComment.textContent = "Temperature feels colder.";     
    }
    feelsLikeElement.textContent = `${Math.round(feelsLikeValue)}°${this.tempUnit.toUpperCase()}`;
  }
  updateUVIndex(){
    let uvIndex = this.weatherData.current.uv;
    let condition = 'good';
    let comment = '';
    if(uvIndex < 3){
      comment = "Low UV, Minimal risk of sunburn.";
    }
    else if(uvIndex < 6){
      comment = "Moderate UV, Moderate risk of sunburn.";
      condition = 'moderate';
    }
    else if(uvIndex < 8){
      comment = "High UV, High risk of sunburn.";
      condition = 'moderate';
    }
    else if(uvIndex < 11){
      comment = "Very high UV, very high risk of sunburn.";
      condition = 'bad';
    }
    else if(uvIndex > 11) {
      comment = "Extreme UV, extremely high risk of sunburn.";
      condition = 'bad';
    }
    let weatherCardComment = document.querySelector("#uv-index ~ .weather-card-comment");
    weatherCardComment.textContent = comment;
    let weatherCardQualityBar = document.querySelector("#uv-index ~ .weather-card-quality-bar");
    weatherCardQualityBar.className = `weather-card-quality-bar ${condition}`;
    let uvIndexElement = document.getElementById("uv-index");
    uvIndexElement.textContent = uvIndex;
  }
  updateHumidity(){
    let humidityElement = document.getElementById("humidity");
    let humidity = this.weatherData.current.humidity;
    humidityElement.textContent = `${Math.round(humidity)}%`;
    let comment = "Very dry conditions, low humidity.";
    if(humidity < 31){
      comment = "Very dry conditions, low humidity.";
    }
    else if(humidity < 51){
      comment = "Comfortable humidity levels, pleasant weather.";
    }
    else if(humidity < 71){
      comment = "Moderately humid, you may feel some moisture in the air.";
    }
    else if(humidity < 91){
      comment = "High humidity, air can feel heavy and sticky.";
    }
    else if(humidity > 91){
      comment = "Extremely humid, often associated with rain or fog.";
    }
    let weatherCardComment = document.querySelector("#humidity ~ .weather-card-comment");
    weatherCardComment.textContent = comment;
  }
  updateWindSpeed(){
    let windSpeedElement = document.getElementById("wind-speed");
    let windSpeed = this.weatherData.current[`wind_${this.windUnit}`];
    windSpeedElement.textContent = `${Math.round(windSpeed)} ${this.windUnit}`;
    let comment;
    if(windSpeed < 11){
      comment = "Calm conditions with minimal to no wind.";
    }
    else if(windSpeed < 21){
      comment = "Light breeze, you can feel a gentle wind on your skin.";
    }
    else if(windSpeed < 31){
      comment = "Moderate breeze, leaves and small branches may move.";
    }
    else if(windSpeed < 51){
      comment = "Strong winds, can make it difficult to hold umbrellas.";
    }
    else if(windSpeed > 51){
      comment = "Severe winds, potential damage to trees and structures.";
    }
    let weatherCardComment = document.querySelector("#wind-speed ~ .weather-card-comment");
    weatherCardComment.textContent = comment;
  }
  updateSunriseSunset(){
    let sunriseElement = document.getElementById("sunrise-time");
    let sunsetElement = document.getElementById("sunset-time");
    let sunrise = this.weatherData.forecast.forecastday[0].astro.sunrise;
    let sunset = this.weatherData.forecast.forecastday[0].astro.sunset;
    sunriseElement.textContent = sunrise;
    sunsetElement.textContent = sunset;
  }
  updateMoonPhase(){
    let moonPhaseElement = document.getElementById("moon-phase");
    let moonPhase = this.weatherData.forecast.forecastday[0].astro.moon_phase;
    moonPhaseElement.textContent = moonPhase;
    let moonComments = {
      "New Moon": "The moon is not visible from Earth.",
      "Waxing Crescent": "A small sliver of the moon is visible.",
      "First Quarter": "Half of the moon is illuminated.",
      "Waxing Gibbous": "More than half of the moon is visible.",
      "Full Moon": "The entire moon is visible and appears fully illuminated.",
      "Waning Gibbous": "More than half of the moon is still visible.",
      "Last Quarter": "Half of the moon is illuminated, but it's decreasing.",
      "Waning Crescent": "A small sliver of the moon is visible, and it's decreasing."
    };
    let weatherCardComment = document.querySelector("#moon-phase ~ .weather-card-comment");
    weatherCardComment.textContent = moonComments[moonPhase];
  }
  updateForecast(){
    let forecastDays = this.weatherData.forecast.forecastday;
    let i = 0;
    forecastDays.forEach((forecastDay) => {
      let forecastElement  = document.getElementById(`forecast-day-${i}`);
      if(forecastElement == undefined){
        return;
      }
      let forecastIcon = document.querySelector(`#forecast-day-${i} .forecast-day-icon`);
      forecastIcon.src = forecastDay.day.condition.icon;
      let forecastTemperature = document.querySelector(`#forecast-day-${i} .forecast-day-temp`);
      let temperature = `${Math.round(forecastDay.day[`avgtemp_${this.tempUnit}`])}°${this.tempUnit.toUpperCase()}`
      forecastTemperature.textContent = temperature;

      let date = parseISO(forecastDay.date);
      let day = format(date, 'EEEE');
      let dayElement = document.querySelector(`#forecast-day-${i} .forecast-day-name`);
      dayElement.textContent = day.substring(0, 3);
      i++;
    })
  }
  updateBackground(){
    if(this.weatherData.current.is_day == 1){
      if(this.weatherData.current.cloud > 40){
        document.body.style.background = `url('./img/cloudy.jpg')`
      }
      else {
        document.body.style.background = `url('./img/sunny.jpg')`
      }
    }
    else {
      document.body.style.background = `url('./img/night.jpg')`;
    }
  }
}