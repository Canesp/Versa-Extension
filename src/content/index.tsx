import React from "react";
import { createRoot } from "react-dom/client";

// Import the App component.
import App from "./app/app";

const rootStyle = `
    @import url("${chrome.runtime.getURL("styles.css")}");

    :host {
        position: fixed;
        top: 20px;
        right: 50px;
        z-index: 9999;
        width: 350px;
        height: 700px;
        border-radius: 0.5rem;
        border-width: 1px;
        border-color: #e2e8f0;
        background-color: #ffffff;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    :host([state="closed"]) {
        display: none;
    }

    :host([state="open"]) {
        display: block;
    }
`;

const onLoaded = () => {
    // Create the style element for the popup UI root Element.
    const style = document.createElement("style");
    style.textContent = rootStyle;

    // Create the root element for the popup UI.
    const root = document.createElement("Shift-App");
    document.documentElement.appendChild(root); 

    // Create the shadow root for the root element.
    const shadowRoot = root.attachShadow({ mode: "open" });
    shadowRoot.appendChild(style); 

    // ------------------------------------------
    // Render the React app in the root element.
    // ------------------------------------------
    createRoot(shadowRoot).render(<App />);

    // ---------------------------------------------
    // Functions to toggle and handle the popup UI.
    // ---------------------------------------------
    root.setAttribute("state", "open"); // Set the initial state of the popup.

    // Function to toggle the popup UI.
    function togglePopup() {
        const state = root.getAttribute("state");

        if (state === "closed") {
            root.setAttribute("state", "open");
        } else {
            root.setAttribute("state", "closed");
        }
    }

    // Event listener to handle the popup UI state when un focused.
    document.addEventListener("mousedown", (event) => {
        if (!root.contains(event.target as Node)) {
            root.setAttribute("state", "closed");
            console.log("Clicked outside");
        }
    });

    // Event listener to handle the popup UI state when extension icon is clicked.
    chrome.runtime.onMessage.addListener((message) => {
        if (message.action === "togglePopup") {
            togglePopup();
        }
    });

    // Event listener to handle the popup UI state when the iframe closes the popup.
    window.onmessage = function (event) {
        if (event.data == "closed") {
            root.setAttribute("state", "closed");
        }
    };
};

// Check if the document is loaded.
if (document.readyState === "complete") {
    onLoaded();
} else {
    window.addEventListener("load", onLoaded);
}