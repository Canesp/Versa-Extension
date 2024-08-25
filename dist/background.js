/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/background/background.ts":
/*!**************************************!*\
  !*** ./src/background/background.ts ***!
  \**************************************/
/***/ (function() {

// Event listener for the browser action (extension icon) click event.
/* chrome.action.onClicked.addListener((tab) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "togglePopup" });
    });
}); */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const base_API = "https://api.frankfurter.app/";
const fetchCurrencies = () => __awaiter(this, void 0, void 0, function* () {
    const response = yield fetch(`${base_API}currencies`);
    const data = yield response.json();
    console.log("Currencies fetched: ", data);
    return data;
});
const fetchRates = () => __awaiter(this, void 0, void 0, function* () {
    const response = yield fetch(`${base_API}latest`);
    const data = yield response.json();
    console.log("Rates fetched: ", data);
    return data;
});
const fetchHistoricalRates = () => __awaiter(this, void 0, void 0, function* () {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    const formattedDate = oneYearAgo.toISOString().split('T')[0];
    const response = yield fetch(`${base_API}${formattedDate}..`); // will fetch the rates from a year ago to the current date.
    const data = yield response.json();
    console.log("Historical rates fetched: ", data);
    return data;
});
// Storing the currencies and rates in the local storage.
const storeCurrencies = (currencies) => {
    chrome.storage.local.set({ currencies: currencies }, () => {
        console.log("Currencies stored in the local storage.");
    });
};
const storeRates = (rates) => {
    const timestamp = Date.now();
    chrome.storage.local.set({ rates: rates, lastFetch: timestamp }, () => {
        console.log("Rates stored in the local storage.");
    });
};
const storeHistoricalRates = (historicalRates) => {
    chrome.storage.local.set({ historicalRates: historicalRates }, () => {
        console.log("Historical rates stored in the local storage.");
    });
};
const storeDefaultCurrencies = () => {
    const defaultCurrencies = {
        "from": "EUR",
        "to": "USD"
    };
    chrome.storage.local.set({ lastChosenCurrencies: defaultCurrencies }, () => {
        console.log("Default currencies stored in the local storage.");
    });
};
const storeDefaultTheme = () => {
    const defaultTheme = "light";
    chrome.storage.local.set({ theme: defaultTheme }, () => {
        console.log("Default theme stored in the local storage.");
    });
};
// Alarms for fetching the currencies and rates every 24 hours at around 16 CET (Central European Time).
const setAlarms = () => {
    const now = new Date();
    const currentUtc = now.getTime() + now.getTimezoneOffset() * 60000;
    const cetOffset = (now.getTimezoneOffset() / 60 === -1 ? 60 : 120) * 60000;
    const primaryFetchTime = new Date(currentUtc + cetOffset);
    primaryFetchTime.setHours(15, 15, 0, 0);
    const fallbackFetchTime = new Date(currentUtc + cetOffset);
    fallbackFetchTime.setHours(16, 0, 0, 0);
    if (primaryFetchTime.getTime() <= currentUtc) {
        primaryFetchTime.setUTCDate(primaryFetchTime.getUTCDate() + 1);
    }
    if (fallbackFetchTime.getTime() <= currentUtc) {
        fallbackFetchTime.setUTCDate(fallbackFetchTime.getUTCDate() + 1);
    }
    const timeUntilPrimaryFetch = primaryFetchTime.getTime() - currentUtc;
    const timeUntilFallbackFetch = fallbackFetchTime.getTime() - currentUtc;
    chrome.alarms.create("primaryFetch", { when: Date.now() + timeUntilPrimaryFetch });
    chrome.alarms.create("fallbackFetch", { when: Date.now() + timeUntilFallbackFetch });
    console.log("Alarms set for fetching rates. Primary fetch at: ", primaryFetchTime, "Fallback fetch at: ", fallbackFetchTime, "Current time: ", now);
};
const checkIfUpToDate = () => __awaiter(this, void 0, void 0, function* () {
    const oneDayInMs = 86400000;
    const now = Date.now();
    chrome.storage.local.get(["lastFetch", "currencies", "rates", "historicalRates"], (result) => {
        const lastFetch = result.lastFetch;
        if (!lastFetch || now - lastFetch > oneDayInMs) {
            fetchRates().then(storeRates).catch(console.error);
        }
        else {
            console.log("Rates are up to date.");
        }
        const currencies = result.currencies;
        const rates = result.rates;
        // If a new currency is added, fetch the currencies again (+1 because the base currency is not included in the currencies object).
        if (!currencies || Object.keys(currencies).length != Object.keys(rates.rates).length + 1) {
            fetchCurrencies().then(storeCurrencies).catch(console.error);
        }
        else {
            console.log("Currencies are up to date.");
            console.log("Currencies: ", currencies);
        }
        const historicalRates = result.historicalRates;
        if (!historicalRates || now - lastFetch > oneDayInMs) {
            fetchHistoricalRates().then(storeHistoricalRates).catch(console.error);
        }
        else {
            console.log("Historical rates are up to date.");
        }
    });
});
// Event listener for the alarms.
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "primaryFetch" || alarm.name === "fallbackFetch") {
        fetchRates().then(storeRates).catch(console.error);
        setAlarms();
    }
});
// Event listener for the installation of the extension.
chrome.runtime.onInstalled.addListener(() => {
    storeDefaultCurrencies();
    storeDefaultTheme();
    checkIfUpToDate();
    setAlarms();
});
// Event listener for Startup.
chrome.runtime.onStartup.addListener(() => {
    checkIfUpToDate();
    setAlarms();
});


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/background/background.ts"]();
/******/ 	
/******/ })()
;
//# sourceMappingURL=background.js.map