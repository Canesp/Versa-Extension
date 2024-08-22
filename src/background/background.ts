// Event listener for the browser action (extension icon) click event.
/* chrome.action.onClicked.addListener((tab) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "togglePopup" });
    });
}); */

const base_API = "https://api.frankfurter.app/";

const fetchCurrencies = async () => {
    const response = await fetch(`${base_API}currencies`);
    const data = await response.json();

    console.log("Currencies fetched: ", data);
    return data;
};

const fetchRates = async () => {
    const response = await fetch(`${base_API}latest`);
    const data = await response.json();
    
    console.log("Rates fetched: ", data);
    return data;
};

// Storing the currencies and rates in the local storage.
const storeCurrencies = (currencies: any) => {
    chrome.storage.local.set({ currencies:currencies }, () => {
        console.log("Currencies stored in the local storage.");
    });
};

const storeRates = (rates: any) => {
    const timestamp = Date.now();
    chrome.storage.local.set({ rates:rates, lastFetch: timestamp }, () => {
        console.log("Rates stored in the local storage.");
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

    chrome.alarms.create("primaryFetch", { when: Date.now() + timeUntilPrimaryFetch});
    chrome.alarms.create("fallbackFetch", { when: Date.now() + timeUntilFallbackFetch});
    console.log("Alarms set for fetching rates. Primary fetch at: ", primaryFetchTime, "Fallback fetch at: ", fallbackFetchTime, "Current time: ", now);
};

const checkIfUpToDate = async () => {
    const oneDayInMs = 86400000;
    const now = Date.now();

    chrome.storage.local.get(["lastFetch", "currencies", "rates"], (result) => {
        const lastFetch = result.lastFetch;

        if (!lastFetch || now - lastFetch > oneDayInMs) {
            fetchRates().then(storeRates).catch(console.error);
        } else {
            console.log("Rates are up to date.");
        }

        const currencies = result.currencies;
        const rates = result.rates;

        // If a new currency is added, fetch the currencies again (+1 because the base currency is not included in the currencies object).
        if (!currencies || Object.keys(currencies).length != Object.keys(rates.rates).length + 1) {
            fetchCurrencies().then(storeCurrencies).catch(console.error);
        } else {
            console.log("Currencies are up to date.");
            console.log("Currencies: ", currencies);
        }
    });
};

// Event listener for the alarms.
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "primaryFetch" || alarm.name === "fallbackFetch") {
        fetchRates().then(storeRates).catch(console.error);
        setAlarms();
    }
})

// Event listener for the installation of the extension.
chrome.runtime.onInstalled.addListener(() => {
    storeDefaultCurrencies();
    checkIfUpToDate();
    setAlarms();
});

// Event listener for Startup.
chrome.runtime.onStartup.addListener(() => {
    checkIfUpToDate();
    setAlarms();
});