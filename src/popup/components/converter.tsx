import React, { useState } from 'react';

// Import Shadcn-ui components.
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// Import custom components.
import Inputfield from "./inputfield";

function Converter() {
    const [input1Amount, setAmount1] = useState("");
    const [input2Amount, setAmount2] = useState("");
    const [selectedCurrency1, setSelectedCurrency1] = useState("");
    const [selectedCurrency2, setSelectedCurrency2] = useState("");

    return (
        <Card className="m-3">
            <CardHeader>
                <div>
                    1 Swedish Krona (SEK)
                </div>

                <div className="text-2xl font-bold">
                    0,086 Euro
                </div>

                <div className="text-xs text-muted-foreground">
                    15 aug. 18:54 UTC · Ansvarsfriskrivning
                </div>
            </CardHeader>

            <CardContent>
                <Inputfield selectedCurrency={selectedCurrency1} setSelectedCurrency={setSelectedCurrency1} amount={input1Amount} setAmount={setAmount1} />
                <div className="p-1 w-full" />
                <Inputfield selectedCurrency={selectedCurrency2} setSelectedCurrency={setSelectedCurrency2} amount={input2Amount} setAmount={setAmount2} />
            </CardContent>

            <CardFooter>
                <p>Card Footer</p>
            </CardFooter>
        </Card>
    )
}

export default Converter;