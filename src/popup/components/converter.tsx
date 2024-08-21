import React from "react";

// Import Shadcn-ui components.
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// Import custom components.
import Inputfield from "./inputfield";

function Converter() {
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
                <Inputfield />
                <div className="p-1 w-full" />
                <Inputfield />
            </CardContent>

            <CardFooter>
                <p>Card Footer</p>
            </CardFooter>
        </Card>
    )
}

export default Converter;