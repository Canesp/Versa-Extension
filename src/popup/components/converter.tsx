import React, { useEffect, useState } from 'react';

// Import Shadcn-ui components.
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

// Import custom components.
import Inputfield from "./inputfield";
import Chart from './chart';

interface Currency {
    label: string;
    value: string;
};

interface FetchTime {
    day: number;
    month: string;
    hour: string;
    minute: string;
    timezone: string;
};

function Converter() {
    const [fromAmount, setFromAmount] = useState("1");
    const [toAmount, setToAmount] = useState("1");
    const [fromCurrency, setFromCurrency] = useState("");
    const [toCurrency, setToCurrency] = useState("");
    const [fromCurrencyName, setFromCurrencyName] = useState("");
    const [toCurrencyName, setToCurrencyName] = useState("");
    const [toRate, setToRate] = useState(0);
    const [rates, setRates] = useState<any>(null);

    const [currencies, setCurrencies] = React.useState<Currency[]>([]);
    const [lastFetch, setLastFetch] = useState<any>(null);
    const [fetchTime, setFetchTime] = useState<FetchTime>({ day: 0, month: "0", hour: "0", minute: "0", timezone: "0" });

    const timestampToDate = (timestamp: number) => {
        const date = new Date(timestamp);
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const month = months[date.getMonth()];
        const hour = date.getHours().toString().padStart(2, "0");
        const minute = date.getMinutes().toString().padStart(2, "0");
        const timezoneOffset = date.getTimezoneOffset();
        const timezoneHours = Math.abs(Math.floor(timezoneOffset / 60)).toString().padStart(2, "0");
        const timezoneMinutes = (timezoneOffset % 60).toString().padStart(2, "0");
        const timezoneSign = timezoneOffset > 0 ? "-" : "+";
        const timezone = `GMT${timezoneSign}${timezoneHours}:${timezoneMinutes}`;

        const timeData = {
            day: date.getDate(),
            month: month,
            hour: hour,
            minute: minute,
            timezone: timezone
        };

        setFetchTime(timeData);
    };

    const storeLastUsedCurrencies = (from: string, to: string) => {
        const lastUsedCurrencies = {
            "from": from,
            "to": to
        };

        chrome.storage.local.set({ lastChosenCurrencies: lastUsedCurrencies }, () => {
            console.log("Default currencies stored in the local storage.");
        });
    };

    const fetchCurrencyData = async () => {
        chrome.storage.local.get(["rates", "lastChosenCurrencies", "currencies", "lastFetch"], (result) => {
            const rates = result.rates;
            const lastUsedCurrencies = result.lastChosenCurrencies;
            const currencies = result.currencies;
            const lastFetch = result.lastFetch;

            console.log("Last fetch: ", lastFetch);

            if (rates) {
                setRates(rates);
            } else {
                console.error("No rates found.");
            }

            if (lastUsedCurrencies) {
                setFromCurrency(lastUsedCurrencies.from);
                setToCurrency(lastUsedCurrencies.to);
            } else {
                console.error("No last used currencies found.");
            }

            if (currencies) {
                const currencyDict = Object.entries(currencies).map(([key, value]) => ({ label: value, value: key }));
                setCurrencies(currencyDict as Currency[]);
            } else {
                console.error("No currencies found.");
            }

            if (lastFetch) {
                setLastFetch(lastFetch);
            } else {
                console.error("No last fetch found.");
            }
        });
    };

    useEffect(() => {
        fetchCurrencyData();
    }, []);

    useEffect(() => {
        if (rates && fromCurrency && toCurrency && lastFetch) {
            toCurrencyChange(toCurrency);
            setToCurrencyName(currencies.find((item) => item.value === toCurrency)?.label || "");
            setFromCurrencyName(currencies.find((item) => item.value === fromCurrency)?.label || "");
            timestampToDate(lastFetch);
        }
    }, [rates, fromCurrency, toCurrency, lastFetch]);

    console.log(fetchTime);

    const convertCurrency = (amount: number, to: string, from: string) => {
        const base = "EUR";

        if (rates) {

            if (from === base) {
                return amount * rates.rates[to];
            } else if (to === base) {
                return amount / rates.rates[from];
            } else if (from === base && to === base) {
                return amount;
            } else if (from === to) {
                return amount;
            } else {
                const amountInBase = amount / rates.rates[from];
                return amountInBase * rates.rates[to];
            }
        } else {
            return 0;
        }
    };

    const fromAmountChange = (amount: string) => {
        setFromAmount(amount);
        setToAmount(convertCurrency(parseFloat(amount), toCurrency, fromCurrency).toFixed(2));
    };

    const toAmountChange = (amount: string) => {
        setToAmount(amount);
        setFromAmount(convertCurrency(parseFloat(amount), fromCurrency, toCurrency).toFixed(2));
    };

    const fromCurrencyChange = (currency: string) => {
        setFromCurrency(currency);
        setToAmount(convertCurrency(parseFloat(fromAmount), toCurrency, currency).toFixed(2));
        setToRate(convertCurrency(1, toCurrency, currency));
        storeLastUsedCurrencies(currency, toCurrency);
    };

    const toCurrencyChange = (currency: string) => {
        setToCurrency(currency);
        setToAmount(convertCurrency(parseFloat(fromAmount), currency, fromCurrency).toFixed(2));
        setToRate(convertCurrency(1, currency, fromCurrency));
        storeLastUsedCurrencies(fromCurrency, currency);
    };

    const fromCurrencyNameChange = (currencyName: string) => {
        setFromCurrencyName(currencyName);
    };

    const toCurrencyNameChange = (currencyName: string) => {
        setToCurrencyName(currencyName);
    }

    return (
        <Card className="m-3">
            <CardHeader>
                <div>
                    1 {fromCurrencyName + " (" + fromCurrency + ")"} equals
                </div>

                <div className="text-2xl font-bold">
                    {toRate.toFixed(2)} {toCurrencyName}
                </div>

                <div className="text-xs text-muted-foreground">
                    {fetchTime.day} {fetchTime.month} {fetchTime.hour}:{fetchTime.minute} {fetchTime.timezone}
                </div>
            </CardHeader>

            <CardContent>
                <Inputfield 
                    selectedCurrency={fromCurrency} 
                    setSelectedCurrency={fromCurrencyChange}
                    selectedCurrencyName={fromCurrencyName}
                    setSelectedCurrencyName={fromCurrencyNameChange} 
                    amount={fromAmount} 
                    setAmount={fromAmountChange}
                    currencies={currencies} 
                />
                <div className="p-1 w-full" />
                <Inputfield 
                    selectedCurrency={toCurrency}
                    setSelectedCurrency={toCurrencyChange}
                    selectedCurrencyName={toCurrencyName}
                    setSelectedCurrencyName={toCurrencyNameChange} 
                    amount={toAmount} 
                    setAmount={toAmountChange}
                    currencies={currencies}
                />
            </CardContent>

            <CardFooter>
                <Chart from={fromCurrency} to={toCurrency} />
            </CardFooter>
        </Card>
    )
}

export default Converter;