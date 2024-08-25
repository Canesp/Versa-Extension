import React, { useEffect, useState } from "react";

// Import Shadcn-ui components.
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator"

// Import the Icons.
import { X, Sun, Moon } from "lucide-react";

// Button functionality.
function windowClose() {
    window.close();
}

function toggleTheme() {
    const root = document.documentElement;
    const theme = root.getAttribute("data-theme");

    if (theme === "dark") {
        root.setAttribute("data-theme", "light");
        
    } else {
        root.setAttribute("data-theme", "dark");
    }
};

function Header() {

    const [theme, setTheme] = useState<string>("light");

    function toggleTheme() {
        const root = document.documentElement;
        const theme = root.getAttribute("data-theme");
    
        if (theme === "dark") {
            root.setAttribute("data-theme", "light");
            setTheme("light");

        } else {
            root.setAttribute("data-theme", "dark");
            setTheme("dark");
        }
    };

    useEffect(() => {
        chrome.storage.local.get("theme", (data) => {
            if (data.theme) {
                setTheme(data.theme);
            }
        });
    }, []);

    useEffect(() => {
        chrome.storage.local.set({ theme: theme });
    }, [theme]);

    if (theme === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
    } 

    return (
        <div>
            <div className="flex items-center justify-between p-2">
                <h1 className="text-2xl font-bold"></h1>

                <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={toggleTheme}>
                        {theme === "light" ? <Sun size={15} className="opacity-50"/> : <Moon size={16}/>}
                    </Button>

                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={windowClose}>
                        <X size={16} />
                    </Button>
                </div>
                
            </div>

            <Separator className="h-[1px] bg-border"/>
        </div>

    );
}

export default Header;
