document.addEventListener("DOMContentLoaded", function () {
  function handleSearch() {
      var inputValue = document.getElementById("inputValue").value;
      console.log("Search clicked! Input Value:", inputValue);
  }
  document.getElementById("searchButton").addEventListener("click", handleSearch);
});
document.addEventListener("DOMContentLoaded", function () {
  function handleSearch() {
      var inputValue = document.getElementById("inputValue").value;

      if (inputValue.trim() !== "") {
          var apiKey = "OPENWEATHER_API_KEY";
          var apiUrl = "https://api.openweathermap.org/data/2.5/weather";
          
          $.ajax({
              url: apiUrl,
              method: "GET",
              data: {
                  q: inputValue,
                  appid: apiKey,
                  units: "metric" 
              },
              success: function (response) {
                  console.log("API Response:", response);
                  updateUI(response);
              },
              error: function (error) {
                  console.error("Error fetching weather data:", error);
              }
          });
      } else {
          console.warn("Please enter a city name.");
      }
  }

  function updateUI(weatherData) {

      var cityName = weatherData.name;
      var temperature = weatherData.main.temp;
      var humidity = weatherData.main.humidity;

      document.querySelector(".city-date-icon").textContent = cityName;
      document.querySelector(".temp").textContent = "Temperature: " + temperature + " °C";
      document.querySelector(".humidity").textContent = "Humidity: " + humidity + "%";

      document.querySelector(".current-weather").classList.remove("hide");
  }

  document.getElementById("searchButton").addEventListener("click", handleSearch);
});
document.addEventListener("DOMContentLoaded", function () {
 
  function handleSearch() {
      var inputValue = document.getElementById("inputValue").value;

      if (inputValue.trim() !== "") {
          var apiKey = "OPENWEATHER_API_KEY";
          var currentWeatherUrl = "https://api.openweathermap.org/data/2.5/weather";
          $.ajax({
              url: currentWeatherUrl,
              method: "GET",
              data: {
                  q: inputValue,
                  appid: apiKey,
                  units: "metric"
              },
              success: function (currentWeatherData) {
                  console.log("Current Weather API Response:", currentWeatherData);
                  updateCurrentWeatherUI(currentWeatherData);
                  saveToSearchHistory(inputValue);
              },
              error: function (error) {
                  console.error("Error fetching current weather data:", error);
              }
          });
      } else {
          console.warn("Please enter a city name.");
      }
  }

  function updateCurrentWeatherUI(weatherData) {
      document.querySelector(".city-date-icon").textContent = cityName;
      document.querySelector(".temp").textContent = "Temperature: " + temperature + " °C";
      document.querySelector(".humidity").textContent = "Humidity: " + humidity + "%";

      document.querySelector(".current-weather").classList.remove("hide");
  }

  function saveToSearchHistory(city) {
      var searchHistoryElement = document.getElementById("recent");
      var listItem = document.createElement("li");
      listItem.textContent = city;
      searchHistoryElement.appendChild(listItem);

      listItem.addEventListener("click", function () {
          handleSearch();
      });
  }

  document.getElementById("searchButton").addEventListener("click", handleSearch);
});
