import React from "react";
import Button from "../components/button";

// Import icons.
import { X, Settings } from "lucide-react";

function buttonClick() {
    console.log("Button clicked!");
}

function App() {
    return (
        <div>
            <h1>Hello World!</h1>
            <Button variant="default" size="sm" onClick={buttonClick}>
                <X  />
            </Button>
        </div>
    );
}

export default App;