/* eslint-disable no-proto */
import {
  addWeatherForm,
  getUserHistory,
  setUserHistory,
  isUsersQuestionUnique,
  checkUserHistoryStatus,
  saveCityToHistory,
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

    expect(isUsersQuestionUnique("New York", userHistory)).toEqual(-1);
    expect(isUsersQuestionUnique("Moscow", userHistory)).toBe(0);
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
    showWetherResults(
      "My city",
      "bad",
      el.querySelector("#weatherCurrentParams"),
      el.querySelector("#weatherCurrentCity")
    );

    expect(el.querySelector("#weatherCurrentParams").innerText).toBe("bad");
    expect(el.querySelector("#weatherCurrentCity").innerText).toBe("My city");
  });
});
