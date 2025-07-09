const weatherKey = "a27326d6b9a2c66090a57eeb97ba9eed";
const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?appid=${weatherKey}&units=metric&q=`;
const timezoneKey = "6WCV5C6ZQ746";
const searchInput = document.getElementById("search-input");
const searchBtn = document.querySelector(".search button");
let currentZoneName = null;

const getTimeZonesByOffset = function (targetOffsetSeconds) {
  const timezone = Intl.supportedValuesOf("timeZone");
  const now = new Date();

  const offset = timezone.filter((tz) => {
    const offsetMinutes = new Date(
      now.toLocaleString("en-US", { timeZone: tz })
    ).getTimezoneOffset();
    console.log(targetOffsetSeconds);
    const offsetSeconds = offsetMinutes * 60;
    return offsetSeconds === targetOffsetSeconds;
  });

  console.log(offset);

  return offset;
};

const startClock = (zoneName) => {
  currentZoneName = zoneName;
  const updateClock = () => {
    const now = new Date();
    const timeFormat = now.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: zoneName,
    });
    document.querySelector(".time").innerHTML = timeFormat;
  };
  updateClock();
  setInterval(updateClock, 60000);
};

const getWeatherData = async function (city) {
  document.querySelector(".weather").style.display = "none";

  const response = await fetch(weatherUrl + city);
  if (response.status === 404) {
    document.querySelector(".error").style.display = "block";
  } else {
    document.querySelector(".error").style.display = "none";
  }

  const weatherData = await response.json();
  console.log(weatherData);
  const timezoneUrl = `http://api.timezonedb.com/v2.1/get-time-zone?key=${timezoneKey}&format=json&by=position&lat=${weatherData.coord.lat}&lng=${weatherData.coord.lon}`;
  const responseTimezone = await fetch(timezoneUrl);
  const timezoneData = await responseTimezone.json();
  let zoneName = timezoneData.zoneName;

  document.querySelector(".city").innerHTML = weatherData.name;
  document.querySelector(".temp").innerHTML =
    Math.round(weatherData.main.temp) + "°C";
  document.querySelector(".humidity").innerHTML =
    weatherData.main.humidity + "%";
  document.querySelector(".wind").innerHTML =
    Math.round(weatherData.wind.speed) + " km/h";
  const image = document.getElementById("weather-icon");
  image.src = `images/${weatherData.weather[0].main}.png`;

  startClock(zoneName);

  document.querySelector(".weather").style.display = "flex";

  return weatherData;
};

window.onload = function () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async function (position) {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?appid=${weatherKey}&units=metric&lat=${lat}&lon=${lon}`;
      const timezoneUrl = `http://api.timezonedb.com/v2.1/get-time-zone?key=${timezoneKey}&format=json&by=position&lat=${lat}&lng=${lon}`;
      const response = await fetch(weatherUrl);
      const weatherData = await response.json();
      const responseTimezone = await fetch(timezoneUrl);
      const timezoneData = await responseTimezone.json();
      let zoneName = timezoneData.zoneName;

      document.querySelector(".city").innerHTML = weatherData.name;
      document.querySelector(".temp").innerHTML =
        Math.round(weatherData.main.temp) + "°C";
      document.querySelector(".humidity").innerHTML =
        weatherData.main.humidity + "%";
      document.querySelector(".wind").innerHTML =
        Math.round(weatherData.wind.speed) + " km/h";
      const image = document.getElementById("weather-icon");
      image.src = `images/${weatherData.weather[0].main}.png`;

      startClock(zoneName);

      document.querySelector(".weather").style.display = "flex";

      return weatherData;
    });
  } else {
    getWeatherData("Madrid");
  }
};

addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    getWeatherData(searchInput.value);
  }
});

searchBtn.addEventListener("click", () => {
  getWeatherData(searchInput.value);
});
