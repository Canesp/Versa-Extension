import React from "react";
import { createRoot } from "react-dom/client";
import "../assets/globals.css";

// Import custom components.
import Header from "./components/header";
import Converter from "./components/converter";
import Footer from "./components/footer";

const popup = (
    <div>
        <Header />
        <Converter />
        <Footer />
    </div>
);

const container = document.createElement("div");
document.body.appendChild(container);
const root = createRoot(container);
root.render(popup);