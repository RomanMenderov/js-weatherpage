/* eslint-disable no-param-reassign */
/* eslint-disable no-use-before-define */
// import { library } from "webpack";
import "regenerator-runtime/runtime";
//  import "core-js/stable";

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
const userHistory = [];

/** working with localStorage start */
export function getUserHistory() {
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
export function isUsersQuestionNotUnique(question, array = userHistory) {
  return array.some((el) => {
    return question.toLowerCase() === el.toLowerCase();
  });
}

export function checkUserHistoryStatus(array) {
  if (array.length <= historyLength) {
    return true;
  }
  return false;
}

export function saveCityToHistory(question, array = userHistory) {
  if (!isUsersQuestionNotUnique(question, array)) {
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
  return (
    showWetherResults(userCity, myWeather),
    showMyMapResults(getMapCityUrl(myWeather.coord))
  );
}
/*
google
export async function getMapCityUrl(coordinates) {
  const apiUrlBasic = "https://maps.googleapis.com/maps/api/staticmap?"
  const size = "200x200";
  const scale = 2;
  const key = "AIzaSyCC5A_TxujNNqvrCyCGXEtb9nRlIsKWPJA";
  let longitude = coordinates.lon;
  let latitude = coordinates.lat;
  let apiUrl = apiUrlBasic + `center=${longitude},${latitude}` +
                `&size=${size}&scale=${scale}&key=${key}`;

  const response = await fetch(apiUrl);
  if (response.ok) {
    const result = await response.json();
    return result;
  }
  return false;
}
*/

export function getMapCityUrl(coordinates) {
  const apiUrlBasic = "https://static-maps.yandex.ru/1.x/?l=map";
  const size = "400,400";
  const zoom = 10;
  //  const key = "ff1506d9-6fce-4710-8c9d-d5a2c11ce32b";
  const longitude = coordinates.lon;
  const latitude = coordinates.lat;
  const apiUrl = `${apiUrlBasic}&ll=${longitude},${latitude}
&size=${size}&z=${zoom}&pt=${longitude},${latitude}`;
  //  apiUrlBasic + `&ll=${longitude},${latitude}` + `&size=${size}&z=${zoom}`; //  + &key=${key};

  return apiUrl;
}

export async function getWeatherCity(cityName) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather
?q=${cityName}&units=metric&appid=${apiKey}`;
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
        showWetherResults(question, myWeather);
        showMyMapResults(getMapCityUrl(myWeather.coord));
      }
    });
    historyElement.appendChild(domElem);
  });
}

export function showWetherResults(
  cityName,
  weatherObj,
  weatherElement = document.getElementById("weatherCurrentParams"),
  cityElement = document.getElementById("weatherCurrentCity")
) {
  if (typeof weatherObj === "string") {
    cityElement.innerHTML = `${cityName}`;
    weatherElement.innerText = weatherObj;
  } else {
    const icoURL = `https://openweathermap.org/img/w/
${weatherObj.weather[0].icon}.png`;
    cityElement.innerHTML = `${cityName}&nbsp;<img width="50" src="${icoURL}">`;
    weatherElement.innerText = `Температура: ${JSON.stringify(
      weatherObj.main.temp
    )}`;
  }
}

export function showMyMapResults(
  myUrl,
  mapElement = document.getElementById("weatherMap")
) {
  if (myUrl) {
    mapElement.src = myUrl;
    mapElement.style.display = "block";
  }
  return false;
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

  const weatherMap = document.createElement("img");
  weatherMap.id = "weatherMap";
  weatherMap.src = "";
  weatherMap.width = "400";
  weatherMap.height = "400";
  weatherMap.style.display = "none";
  el.appendChild(weatherMap);

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
        myWeather,
        weatherCurrentParams,
        weatherCurrentCity
      );
      saveCityToHistory(question);
      showUserHistory(userHistory, cityList);
      showMyMapResults(getMapCityUrl(myWeather.coord), weatherMap);
    } else {
      showWetherResults(
        question,
        "по этому запросу нет данных",
        weatherCurrentParams,
        weatherCurrentCity
      );
    }
  });

  getUserHistory().forEach((arrElement) => {
    userHistory.push(arrElement);
  });
  showUserHistory(userHistory, cityList);
  showMyWeather();
}

/** working with End start */
addWeatherForm(document.getElementsByTagName("body")[0]);
