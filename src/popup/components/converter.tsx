import React, { useEffect, useState } from 'react';

// Import Shadcn-ui components.
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// Import custom components.
import Inputfield from "./inputfield";

interface Currency {
    label: string;
    value: string;
}

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

    const fetchCurrencyData = async () => {
        chrome.storage.local.get(["rates", "lastChosenCurrencies", "currencies"], (result) => {
            const rates = result.rates;
            const lastUsedCurrencies = result.lastChosenCurrencies;
            const currencies = result.currencies;

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
        });
    };

    useEffect(() => {
        fetchCurrencyData();
    }, []);

    useEffect(() => {
        if (rates && fromCurrency && toCurrency) {
            toCurrencyChange(toCurrency);
            setToCurrencyName(currencies.find((item) => item.value === toCurrency)?.label || "");
            setFromCurrencyName(currencies.find((item) => item.value === fromCurrency)?.label || "");
        }
    }, [rates, fromCurrency, toCurrency]);

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
    };

    const toCurrencyChange = (currency: string) => {
        setToCurrency(currency);
        setToAmount(convertCurrency(parseFloat(fromAmount), currency, fromCurrency).toFixed(2));
        setToRate(convertCurrency(1, currency, fromCurrency));
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
                    15 aug. 18:54 UTC · Ansvarsfriskrivning
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
                <p>Card Footer</p>
            </CardFooter>
        </Card>
    )
}

export default Converter;