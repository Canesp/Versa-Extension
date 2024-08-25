import React from "react";

// Import Shadcn-ui components.
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator"

// Import the Icons.
import { X } from "lucide-react";

// Button functionality.
function windowClose() {
    window.close();
}


function Header() {
    return (
        <div>
            <div className="flex items-center justify-between p-2">
                <h1 className="text-2xl font-bold"></h1>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={windowClose}>
                    <X size={16} />
                </Button>
            </div>

            <Separator className="h-[1px] bg-border"/>
        </div>

    );
}

export default Header;
