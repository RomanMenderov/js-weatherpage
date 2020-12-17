/* eslint-disable no-proto */
import {
  addWeatherForm,
  getUserHistory,
  setUserHistory,
  isUsersQuestionNotUnique,
  checkUserHistoryStatus,
  saveCityToHistory,
  getMapCityUrl,
  showMyMapResults,
  //  getUserCity,
  showUserHistory,
  showWetherResults,
  //  getWeatherFromCityElement,
} from "./index";

describe("test 1st task", () => {
  let el;
  const userHistoryLocalName = "userCityHistory";
  //  let historyLength = 10;
  let userHistory;

  beforeEach(() => {
    //  jest.spyOn(console, "log");
    el = document.createElement("div");
    userHistory = [];
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("it should create basic markup", () => {
    addWeatherForm(el);
    expect(el.querySelector("input")).not.toBe(null);
  });

  test("it should create map url", () => {
    const myCoord = { lon: Math.random(), lat: Math.random() };
    expect(getMapCityUrl(myCoord)).toEqual(
      expect.stringContaining(`${myCoord.lon},${myCoord.lat}`)
    );
  });

  test("it should check user history", () => {
    jest.spyOn(window.localStorage.__proto__, "getItem");
    window.localStorage.__proto__.setItem = jest.fn();
    getUserHistory();
    expect(localStorage.getItem).toHaveBeenCalledWith(userHistoryLocalName);
  });

  test("it should save new data in localstoradge", () => {
    jest.spyOn(window.localStorage.__proto__, "setItem");
    window.localStorage.__proto__.setItem = jest.fn();
    setUserHistory(["Minsk", "Moskow"]);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      userHistoryLocalName,
      '["Minsk","Moskow"]'
    );
  });

  test("it should check if city is unique ", () => {
    userHistory.push("Moscow");

    expect(isUsersQuestionNotUnique("New York", userHistory)).toEqual(false);
    expect(isUsersQuestionNotUnique("Moscow", userHistory)).toBe(true);
  });

  test("it should check if history length allowed", () => {
    expect(checkUserHistoryStatus(new Array(10))).toBe(true);
    expect(checkUserHistoryStatus(new Array(12))).toBe(false);
  });

  test("it should check if history data correct work", () => {
    jest.spyOn(window.localStorage.__proto__, "setItem");
    window.localStorage.__proto__.setItem = jest.fn();
    userHistory.push("Moscow");
    userHistory.push("Piter");
    // historyLength = 10;

    saveCityToHistory("Vilnus", userHistory);

    expect(localStorage.setItem).toHaveBeenCalledWith(
      userHistoryLocalName,
      '["Vilnus","Moscow","Piter"]'
    );
  });
  test("it should check if we show users history", () => {
    addWeatherForm(el);
    showUserHistory(["123", "321"], el.querySelector("#cityList"));

    expect(el.querySelectorAll("#cityList > li")[0].innerText).toBe("123");
  });
  /* test("it should check if we get users city", () => {
    global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ city: "Moscow" }),
  })
);
    //fetch.mockImplementationOnce(() => Promise.resolve({ city: "Moscow" }));
    let city = getUserCity();
    expect(city).toBe("Moscow");
  }); */
  test("it should check if wether is on site", () => {
    addWeatherForm(el);
    const temp = Math.random();
    showWetherResults(
      "My city",
      {
        coord: { lon: 21.78, lat: 38.3 },
        weather: [
          { id: 501, main: "Rain", description: "moderate rain", icon: "10n" },
        ],
        main: { temp },
      },
      el.querySelector("#weatherCurrentParams"),
      el.querySelector("#weatherCurrentCity")
    );

    expect(el.querySelector("#weatherCurrentParams").innerText).toBe(
      `Температура: ${temp}`
    );
    expect(el.querySelector("#weatherCurrentCity").innerHTML).toBeTruthy();

    showWetherResults(
      "My city",
      "не найдено",
      el.querySelector("#weatherCurrentParams"),
      el.querySelector("#weatherCurrentCity")
    );
    expect(el.querySelector("#weatherCurrentParams").innerText).toBe(
      `не найдено`
    );
    expect(el.querySelector("#weatherCurrentCity").innerHTML).toBe(`My city`);
  });

  test("it should check if map is on site", () => {
    addWeatherForm(el);
    const mapElement = el.querySelector("#weatherMap");
    showMyMapResults("http://", mapElement);

    expect(mapElement.src).toBe(`http://`);
    expect(mapElement.style.display).toBe("block");
  });
});
