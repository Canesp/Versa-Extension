import React from "react";

// Import Shadcn UI components.
import { cn } from "@/lib/utils"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

// Import Icons.
import { Check, ChevronsUpDown } from "lucide-react"

// Currency
const currency = [
    {
        label: "Swedish Krona (SEK)",
        value: "0.086 Euro",
    },
    {
        label: "Euro",
        value: "11.65 Swedish Krona",
    }
];

function Inputfield() {

    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState("");
    
    return (
        <div className="w-full rounded-md border border-input flex items-center focus-within:ring-2 focus-within:ring-ring">
            <Input type="number" placeholder="Amount" className="border-none w-[120px] focus-visible:ring-0 focus-visible:ring-offset-0"/>

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild className="border-0 border-l rounded-l-none w-full">
                    <Button variant="outline" role="combobox" aria-expanded={open} className="flex justify-between items-center w-full">
                        <div className="w-full overflow-hidden">
                            {value ? currency.find((item) => item.value === value)?.label : "Select currency"}
                        </div>

                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                    
                </PopoverTrigger>

                <PopoverContent className="w-full p-0">
                    <Command>
                        <CommandInput placeholder="Search currency" />
                        <CommandList>
                            <CommandEmpty>No results found</CommandEmpty>
                            <CommandGroup>
                                {currency.map((item) => (
                                    <CommandItem
                                        key={item.value}
                                        value={item.value}
                                        onSelect={(currentValue) => {
                                            setValue(currentValue === value ? "" : currentValue)
                                            setOpen(false)
                                        }}
                                   >
                                        <Check
                                            className={cn("mr-2 h-4 w-4", value === item.value ? "opacity-100" : "opacity-0")}
                                        />
                                        {item.label}
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