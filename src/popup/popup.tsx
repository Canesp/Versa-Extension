import React from "react";
import { createRoot } from "react-dom/client";
import "../assets/globals.css";

import { Button } from "@/components/ui/button";

const popup = (
    <div>
        <h1 className="text-5xl text-green-500">Hello World!</h1>
        <Button variant="outline" onClick={() => alert("Hello World!")}>Click</Button>
    </div>
);

const container = document.createElement("div");
document.body.appendChild(container);
const root = createRoot(container);
root.render(popup);
