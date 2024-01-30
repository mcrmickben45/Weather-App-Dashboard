const searchInput = document.querySelector(".inputValue");
const searchBtn = document.querySelector(".searchBtn");
const currentDate = moment();
const cityDateIcon = document.querySelector(".city-date-icon");
const topContainer = document.querySelector(".current-weather");
const temp = document.querySelector(".temp");
const humidity = document.querySelector(".humidity");
const wind = document.querySelector(".wind");
const uvi = document.querySelector(".uvi");
const recentContainer = $("#recent");
const inputValue = $("#inputValue");
const clear = $("#clearHistory");
let recentSearches = JSON.parse(localStorage.getItem("recents") || "[]");

function renderRecents() {
  recentContainer.empty();

  for (let i = 0; i < recentSearches.length; i++) {
    const recentInput = $("<input>").attr({
      type: "text",
      readonly: true,
      class: "form-control-lg text-black",
      value: recentSearches[i],
    });

    recentInput.on("click", function () {
      getWeather($(this).val());
    });

    recentContainer.append(recentInput);
  }
}

async function getWeather(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=9795009f60d5d1c3afe4e6df6002c319`;

  try {
    const response = await fetch(apiUrl);

    if (response.ok) {
      const data = await response.json();
      const nameValue = data.name;
      const tempValue = data.main.temp;
      const humidityValue = data.main.humidity;
      const windValue = data.wind.speed;
      const icon = data.weather[0].icon;

      const weatherURL = `https://openweathermap.org/img/wn/${icon}.png`;

      cityDateIcon.innerHTML =
        `${nameValue} ${currentDate.format(" (M/DD/YYYY) ")} <img src="${weatherURL}"/>`;
      temp.innerHTML = `Temperature: ${tempValue} °F`;
      humidity.innerHTML = `Humidity: ${humidityValue}%`;
      wind.innerHTML = `Wind Speed: ${windValue} MPH`;

      topContainer.classList.remove("hide");

      setLocalStorage(city);
      renderRecents();
    } else {
      alert("Error: " + response.statusText);
    }
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}

function setLocalStorage(city) {
  if (!recentSearches.includes(city)) {
    recentSearches.push(city);
    localStorage.setItem("recents", JSON.stringify(recentSearches));
  }
}

$(document).ready(function () {
  searchBtn.on("click", function () {
    const userInput = inputValue.val().trim();

    if (userInput !== "") {
      getWeather(searchInput.value);
      inputValue.val("");
    } else {
      alert("Please enter a city!");
    }
  });
});


clear.on("click", function () {
  localStorage.removeItem("recents");
  recentSearches = [];
  renderRecents();
});

async function uvIndex(lat, lon) {
  const uviUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=9795009f60d5d1c3afe4e6df6002c319`;

  try {
    const response = await fetch(uviUrl);

    if (response.ok) {
      const data = await response.json();
      const uviValue = data.current.uvi;
      const fiveDayData = data.daily;

      uvi.textContent = uviValue;

      setUviBadge(uviValue);

      let cardString = "";
      const fiveDayHeader = document.querySelector(".fiveDayHeader");
      fiveDayHeader.textContent = "5-Day Forecast:";

      for (let i = 0; i < Math.min(fiveDayData.length, 5); i++) {
        const cardData = fiveDayData[i];
        const cardTemp = cardData.temp.day;
        const cardHumidity = cardData.humidity;
        const iconImage = cardData.weather[0].icon;
        const weatherURL = `https://openweathermap.org/img/wn/${iconImage}.png`;

        cardString += `
          <div class="card fiveDayCard" style="flex: 1">
            <h4 class="dateHeader">${moment(new Date(cardData.dt * 1000)).format(" M/DD/YYYY")}</h4>
            <img src="${weatherURL}" style="width: 75px"/>
            <p>Temp: ${cardTemp}&deg;F</p>
            <p>Humidity: ${cardHumidity}%</p>
          </div>
        `;
      }

      const fiveDayCardContainer = document.querySelector("#cards");
      fiveDayCardContainer.innerHTML = cardString;
    } else {
      alert("Error fetching UV index data:", response.statusText);
    }
  } catch (error) {
    console.error("Error fetching UV index data:", error);
  }
}

function setUviBadge(uviValue) {
  const uviLine = document.querySelector(".uviValue");

  uviLine.textContent = uviValue;

  uviLine.classList.remove("badge", "badge-danger", "badge-warning", "badge-success", "badge-info");

  if (uviValue >= 8) {
    uviLine.classList.add("badge", "badge-danger");
  } else if (uviValue >= 6 && uviValue < 8) {
    uviLine.classList.add("badge", "badge-warning");
  } else if (uviValue >= 3 && uviValue < 6) {
    uviLine.classList.add("badge", "badge-success");
  } else {
    uviLine.classList.add("badge", "badge-info");
  }
}

renderRecents();
