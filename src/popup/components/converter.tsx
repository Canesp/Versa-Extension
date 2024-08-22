import React, { useEffect, useState } from 'react';

// Import Shadcn-ui components.
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// Import custom components.
import Inputfield from "./inputfield";

function Converter() {
    const [fromAmount, setFromAmount] = useState("1");
    const [toAmount, setToAmount] = useState("");
    const [fromCurrency, setFromCurrency] = useState("USD");
    const [toCurrency, setToCurrency] = useState("EUR");
    const [fromCurrencyName, setFromCurrencyName] = useState("United States Dollar");
    const [toCurrencyName, setToCurrencyName] = useState("");
    const [toRate, setToRate] = useState(0);
    const [rates, setRates] = useState<any>(null);

    const fetchRates = async () => {
        chrome.storage.local.get(["rates"], (result) => {
            const rates = result.rates;
            if (rates) {
                setRates(rates);
            } else {
                console.error("No rates found.");
            }
        });
    };

    useEffect(() => {
        fetchRates();
    }, []);

    const convertCurrency = (amount: number, to: string, from: string) => {
        const base = "EUR";

        if (rates) {
            if (from === base) {
                return amount * rates.rates[to];
            } else if (to === base) {
                return amount / rates.rates[from];
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
                    setSelectedCurrencyName={setFromCurrencyName} 
                    amount={fromAmount} 
                    setAmount={fromAmountChange} 
                />
                <div className="p-1 w-full" />
                <Inputfield 
                    selectedCurrency={toCurrency}
                    setSelectedCurrency={toCurrencyChange}
                    selectedCurrencyName={toCurrencyName}
                    setSelectedCurrencyName={setToCurrencyName} 
                    amount={toAmount} 
                    setAmount={toAmountChange}
                />
            </CardContent>

            <CardFooter>
                <p>Card Footer</p>
            </CardFooter>
        </Card>
    )
}

export default Converter;