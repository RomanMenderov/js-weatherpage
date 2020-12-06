/* eslint-disable no-param-reassign */
/* eslint-disable no-use-before-define */
// import { library } from "webpack";

/**
 * 
 * Создайте страницу:
при открытии страницы пользователь видит погоду (город, температуру и иконку) в своей местности (для получения прогноза погоды используйте https://openweathermap.org/current )
он может ввести имя города в поле ввода и увидеть погоду в выбранном городе
введенные города сохраняются у пользователя в браузере, так что он видит последние 10 городов, где он смотрел погоду
при клике по строчке города в списке он видит погоду в выбранном городе
кроме информации о погоде покажите в центре страницы карту для введенного адреса (используйте Google Maps Static API https://developers.google.com/maps/documentation/maps-static/start )
 * 
 * 
 * 
 */
const userHistoryLocalName = "userCityHistory";
const apiKey = "fa5292c9164722fbd4dd9fb5132d9ea9";
const historyLength = 10;
const userHistory = getUserHistory();

/** working with localStorage start */
export async function getUserHistory() {
  const result = localStorage.getItem(userHistoryLocalName);
  if (result) {
    return JSON.parse(result);
  }
  return [];
}

export async function setUserHistory(array) {
  return localStorage.setItem(userHistoryLocalName, JSON.stringify(array));
}

/** working with localStorage end */

/** working with userHistoryArr start */
export function isUsersQuestionUnique(question, array = userHistory) {
  return array.indexOf(question);
}

export function checkUserHistoryStatus(array) {
  if (array.length <= historyLength) {
    return true;
  }
  return false;
}

export function saveCityToHistory(question, array = userHistory) {
  if (isUsersQuestionUnique(question, array) === -1) {
    array.unshift(question);
    if (!checkUserHistoryStatus(array)) {
      array.pop();
    }
  }
  return setUserHistory(array);
}

/** working with userHistoryArr end */

/** working with API start */
export async function getUserCity() {
  const apiUrl = "https://get.geojs.io/v1/ip/geo.json";
  const response = await fetch(apiUrl);
  if (response.ok) {
    const result = await response.json();
    return result.city;
  }
  return false;
}

export async function showMyWeather() {
  const userCity = await getUserCity();
  const myWeather = await getWeatherCity(userCity);
  return showWetherResults(userCity, myWeather);
}

export async function getWeatherCity(cityName) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather
  ?q=${cityName}&appid=${apiKey}`;
  const response = await fetch(apiUrl);
  if (response.ok) {
    const result = await response.json();
    return result;
  }
  return false;
}

/** working with API end */

/** working with Interface start */
export function showUserHistory(array, historyElement) {
  historyElement.innerHTML = "";
  return array.forEach((element) => {
    const domElem = document.createElement("li");
    domElem.innerText = element;
    domElem.addEventListener("click", async () => {
      const question = domElem.innerText;
      const myWeather = await getWeatherCity(question);
      if (myWeather) {
        showWetherResults(question, JSON.stringify(myWeather));
      }
    });
    historyElement.appendChild(domElem);
  });
}

export function showWetherResults(
  cityName,
  weather,
  weatherElement = document.getElementById("weatherCurrentParams"),
  cityElement = document.getElementById("weatherCurrentCity")
) {
  cityElement.innerText = cityName;
  weatherElement.innerText = weather;
}

export async function getWeatherFromCityElement(element) {
  const cityName = element.innerText;
  const weather = await getWeatherCity(cityName);
  return showWetherResults(cityName, weather);
}

export function addWeatherForm(el) {
  const weatherBlock = document.createElement("div");
  weatherBlock.id = "weatherDescription";

  const weatherCurrentCity = document.createElement("span");
  weatherCurrentCity.id = "weatherCurrentCity";
  weatherBlock.appendChild(weatherCurrentCity);

  const weatherCurrentParams = document.createElement("p");
  weatherCurrentParams.id = "weatherCurrentParams";
  weatherBlock.appendChild(weatherCurrentParams);

  el.appendChild(weatherBlock);

  const input = document.createElement("input");
  input.id = "input";
  el.appendChild(input);

  const button = document.createElement("button");
  button.id = "button";
  button.innerText = "Проверить погоду";
  el.appendChild(button);

  const cityList = document.createElement("ul");
  cityList.id = "cityList";
  el.appendChild(cityList);

  button.addEventListener("click", async () => {
    const question = input.value;
    input.value = "";
    const myWeather = await getWeatherCity(question);
    if (myWeather) {
      showWetherResults(
        question,
        JSON.stringify(myWeather),
        weatherCurrentParams,
        weatherCurrentCity
      );
      saveCityToHistory(question);
      showUserHistory(userHistory, cityList);
    } else {
      showWetherResults(
        question,
        "по этому запросу нет данных",
        weatherCurrentParams,
        weatherCurrentCity
      );
    }
  });

  showMyWeather();
}

/** working with End start */
addWeatherForm(document.getElementsByTagName("body")[0]);
