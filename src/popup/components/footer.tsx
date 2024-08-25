import React, { useEffect, useState } from "react";

// Import Shadcn-ui components.
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// Import the Icons.
import { Heart, Info } from "lucide-react";



function Footer() {
    return (
        <div className="flex items-center justify-between p-3">
            <div className="flex items-center space-x-2">
                <Switch id="Toggle-Select"/>
                <Label htmlFor="Toggle-Select" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 opacity-50">Enable Select</Label>
            </div>

            <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" className="w-9 h-9 ">
                    <Info size={16} className="opacity-50"/>
                </Button>

                <Button variant="outline" size="icon" className="w-9 h-9 ">
                    <Heart size={16} color="red"/>
                </Button>
            </div>
        </div>
    );
}

export default Footer;