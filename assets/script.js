// DOM elements
const searchInput = document.querySelector(".inputValue");
const searchBtn = document.querySelector(".searchBtn");
const currentDate = moment();
const cityDateIcon = document.querySelector(".city-date-icon");
const topContainer = document.querySelector(".current-weather");
const temp = document.querySelector(".temp");
const humidity = document.querySelector(".humidity");
const wind = document.querySelector(".wind");
const uvi = document.querySelector(".uvi");

// Retrieve recent searches from local storage
const recentSearches = JSON.parse(localStorage.getItem("recents") || "[]");
const recentContainer = $("#recent");
const inputValue = $("#inputValue");
const clear = $("#clearHistory");

// Render recent searches
renderRecents();

// Function to render recent searches in the UI
function renderRecents() {
  recentContainer.empty();

  for (let i = 0; i < recentSearches.length; i++) {
    // Create input elements for each recent search
    var recentInput = $("<input>");
    recentInput.attr("type", "text");
    recentInput.attr("readonly", true);
    recentInput.attr("class", "form-control-lg text-black");
    recentInput.attr("value", recentSearches[i]);

    // Attaches click event to fetch weather for the selected city
    recentInput.on("click", function() {
      getWeather($(this).attr("value"));
    });
    recentContainer.append(recentInput);
  }
}

// Event handler for the search form submission
var searchSubmitHandler = function (event) {
  event.preventDefault;

  var city = searchInput.value.trim();

  if (city) {
    getCityWeather(city);

    searchInput.value = "";
  } else if (userInput == "") {
    alert("Please enter a city!");
  }
};

// Async function to fetch weather data for a given city
async function getWeather(city) {
    var apiUrl =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      city +
      "&units=imperial&appid=9795009f60d5d1c3afe4e6df6002c319";
  
    var response = await fetch(apiUrl);
    if (response.ok) {
      var data = await response.json();
      var nameValue = data.name;
      var tempValue = data.main.temp;
      var humidityValue = data.main.humidity;
      var windValue = data.wind.speed;
      console.log(data);
      var lat = data.coord.lon;
      var lon = data.coord.lat;

      // Fetch UV index for the given coordinates
      await uvIndex(data.coord.lat, data.coord.lon);

      var icon = data.weather[0].icon;
      var weatherURL = `https://openweathermap.org/img/wn/${icon}.png`;
      var icon = `<img src="${weatherURL}"/>`;
  
      // Update UI with weather information
      cityDateIcon.innerHTML =
        nameValue + currentDate.format(" (M/DD/YYYY) ") + icon;
      temp.innerHTML = "Temperature: " + tempValue + " °F";
      humidity.innerHTML = "Humidity: " + humidityValue + "%";
      wind.innerHTML = "Wind Speed: " + windValue + " MPH";
        topContainer.classList.remove("hide");
      console.log(icon);

      // Check for duplicate searches in recent searches
      let newWeatherItem = city;
      var newSearches = recentSearches.filter((search) => {
          if (search.city === newWeatherItem.city) {
              return false;
          } else {
              return true;
          }
      }
      );
    } else {
      alert("Error: " + response.statusText);
    }
  };

  // Function to update local storage with recent searches
  function setLocalStorage(city) {
    if (recentSearches.indexOf(city) === -1) {
      recentSearches.push(city);
      localStorage.setItem("recents", JSON.stringify(recentSearches));
    }
  }

// Event listener for the search button click
searchBtn.addEventListener("click", () => {
  var userInput = inputValue.val().trim();
  if (userInput !== "") {
    getWeather(searchInput.value);
    setLocalStorage(searchInput.value);
renderRecents();
    inputValue.val("");
  } else if (userInput == "") {
alert("Please enter a city!");
  }
});

// Event listener for clearing search history
clear.on("click", function() {
  localStorage.removeItem("recents");
  recentSearches.length = 0;
  renderRecents();
});

// Async function to fetch UV index data for a given coordinates
async function uvIndex(lat, lon) {
  var uviUrl =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    lat +
    "&lon=" +
    lon +
    "&units=imperial&appid=9795009f60d5d1c3afe4e6df6002c319";
  var response = await fetch(uviUrl);

  if (response.ok) {
    console.log(response);
    var data = await response.json();
    console.log(data);
    var uviValue = data.current.uvi;
    var fiveDayData = data.daily;
    console.log(fiveDayData);
    var uviLine = document.querySelector(".uviValue")
    uviLine.textContent = uviValue;

    // Set UV index badge color based on value
    if (uviValue >= 8) {
        uviLine.classList.add("badge", "badge-danger");
    }
    if (uviValue >= 6 && uviValue < 8) {
        uviLine.classList.add("badge", "badge-warning");
    }
    if (uviValue < 6 && uviValue >=3) {
        uviLine.classList.add("badge", "badge-success");
    }
    if (uviValue < 3) {
        uviLine.classList.add("badge", "badge-info");
    }

    // Prepares HTML string for 5-day forecast cards
    var cardString = "";
    var fiveDayHeader = document.querySelector(".five-day-forecast");
    var forecastHeader = document.querySelector(".fiveDayHeader");
    forecastHeader.textContent="5-Day Forecast:";
    fiveDayHeader.prepend(forecastHeader);
    for (var i = 0; i < fiveDayData.length; i++) {
      if (i >= 5) break;
      var cardData = fiveDayData[i];
      var cardTemp = cardData.temp.day;
      var cardHumidity = cardData.humidity;
      var iconImage = cardData.weather[0].icon;
      var weatherURL = `https://openweathermap.org/img/wn/${iconImage}.png`;
      var icon = `<img src="${weatherURL}" style="width: 75px"/>`;
      cardString += `
            <div class="card fiveDayCard" style="flex: 1">
                <h4 class="dateHeader">${moment(new Date(cardData.dt * 1000)).format(
                  " M/DD/YYYY"
                )}</h4>
                    ${icon}
                <p>Temp: ${cardTemp}&deg;F</p>
                <p>Humidity: ${cardHumidity}%</p>
            </div>
        `;
    }
    console.log(cardString);
    var fiveDayCardContainer = document.querySelector("#cards");
    fiveDayCardContainer.innerHTML = cardString;
  }
}