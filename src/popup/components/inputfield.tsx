import React from "react";

// Import Shadcn UI components.
import { cn } from "@/lib/utils"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"

// Import Icons.
import { Check, ChevronsUpDown } from "lucide-react"

// Currency
interface Currency {
    label: string;
    value: string;
}

// InputfieldProps
interface InputfieldProps {
    selectedCurrency: string;
    setSelectedCurrency: (value: string) => void;
    selectedCurrencyName: string;
    setSelectedCurrencyName: (value: string) => void;
    amount: string;
    setAmount: (value: string) => void;
}

function Inputfield({ selectedCurrency, setSelectedCurrency, selectedCurrencyName, setSelectedCurrencyName, amount, setAmount }: InputfieldProps) {

    const [open, setOpen] = React.useState(false);
    const [currencies, setCurrencies] = React.useState<Currency[]>([]);

    // Fetch the currencies from the local storage.
    const fetchCurrencies = async () => {
        chrome.storage.local.get(["currencies"], (result) => {
            const currencies = result.currencies;
            if (currencies) {
                const currencyDict = Object.entries(currencies).map(([key, value]) => ({ label: value, value: key }));
                setCurrencies(currencyDict as Currency[]);
            } else {
                console.error("No currencies found.");
            }
        });
    };

    React.useEffect(() => {
        fetchCurrencies();
    }, []);
    
    return (
        <div className="w-full rounded-md border border-input flex items-center focus-within:ring-2 focus-within:ring-ring">
            <Input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="border-none w-[120px] focus-visible:ring-0 focus-visible:ring-offset-0"/>

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild className="border-0 border-l rounded-l-none w-full">
                    <Button variant="outline" role="combobox" aria-expanded={open} className="flex justify-between items-center w-full">
                        <span className="overflow-hidden text-ellipsis w-[100px] text-left">
                            {selectedCurrency ? currencies.find((item) => item.value === selectedCurrency)?.label : "Select currency"}
                        </span>

                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                    
                </PopoverTrigger>

                <PopoverContent className="w-full p-0">
                    <Command>
                        <CommandInput placeholder="Search currency" />
                        <CommandList>
                            <CommandEmpty>No results found</CommandEmpty>
                            <CommandGroup>
                                {currencies.map((currency) => (
                                    <CommandItem
                                        key={currency.value}
                                        onSelect={() => {
                                            setSelectedCurrency(currency.value);
                                            setSelectedCurrencyName(currency.label);
                                            setOpen(false);
                                        }}
                                   >
                                        <Check
                                            className={cn("mr-2 h-4 w-4", selectedCurrency === currency.value ? "opacity-100" : "opacity-0")}
                                        />
                                        {currency.label}
                                    </CommandItem>        
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>    
        </div>
    );
}

export default Inputfield;