import React, { useEffect, useState } from "react";

// Import Shadcn-ui components.
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface chartData {
    date: string;
    rate: number;
}

interface ChartProps {
    from: string;
    to: string;
    selectedRange: string;
}

function Chart( { from, to, selectedRange }: ChartProps ) {

    const [historicalRates, setHistoricalRates] = useState<any>({});
    const [chartData, setChartData] = useState<chartData[]>([]);
    //const [selectedRange, setSelectedRange] = useState<string>("365");
    const [chartConfig, setChartConfig] = useState<ChartConfig>({ rates: { label: "USD", color: "hsl(var(--chart-2))" } });

    const getColor = (rate1: number, rate2: number) => {
        return rate1 > rate2 ? "hsl(var(--chart-1))" : "hsl(var(--chart-2))";
    };

    const fetchHistoricalRates = async () => {
        chrome.storage.local.get("historicalRates", (data) => {
            const historicalRates = data.historicalRates;

            if (historicalRates) {
                setHistoricalRates(historicalRates);
            }
        });
    };

    const filterHistoricalRates = (historicalRates: any) => {
        const filteredData: chartData[] = [];
        const fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - parseInt(selectedRange));
        
        for (const date in historicalRates.rates) {
            if (new Date(date) >= fromDate) {

                let rate: number = 0;

                if (from === "EUR") {
                    rate = historicalRates.rates[date][to];
                } else if (to === "EUR") {
                    rate = 1 / historicalRates.rates[date][from];
                } else if (from === "EUR" && to === "EUR") {
                    rate = 1;
                }else {
                    rate = historicalRates.rates[date][to] / historicalRates.rates[date][from];
                } 

                filteredData.push({
                    date: date,
                    rate: Number(rate)
                });
            }
        }

        console.log("Filtered data: ", filteredData);

        return filteredData;
    };

    const domainValues = (data: chartData[]) => {
        const values = data.map((item) => item.rate);
        const min = Math.min(...values);
        const max = Math.max(...values);
        const padding = (max - min) * 0.1;

        return [min, max + padding];
    };

    const dateFormatted = (date: string) => {
        const dateObj = new Date(date);
        const currentDate = new Date();
        const year = dateObj.getFullYear();
        const month = dateObj.toLocaleString("default", { month: "short" });
        const day = dateObj.getDate();

        if (year !== currentDate.getFullYear()) {
            return `${year} ${month}`;
        } else {
            return `${day} ${month}`;
        }
    };

    const updateChartData = () => {
        const filteredData = filterHistoricalRates(historicalRates);
        setChartData(filteredData);
    }; 

    const updateChartConfig = () => {
        const color = getColor(chartData[0].rate, chartData[chartData.length - 1].rate);

        setChartConfig({
            rates: {
                label: to,
                color: color
            }
        });
    };

    useEffect(() => {
        fetchHistoricalRates();
    }, []);

    useEffect(() => {
        updateChartData();
    }, [historicalRates, selectedRange, from, to]);

    useEffect(() => {
        if (chartData.length > 0) {
            updateChartConfig();
        }
    }, [chartData, from, to]);

    console.log("Chart config updated: ", chartConfig);

    return (
        <div className="w-full">
            <ChartContainer config={chartConfig}>
                <AreaChart accessibilityLayer data={chartData} margin={{left: -12, right: 6}}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => dateFormatted(value)}/>
                    <YAxis dataKey="rate" tickLine={true} axisLine={false} tickMargin={8} tickCount={4} domain={domainValues(chartData)} tickFormatter={(value) => value.toFixed(3)}/>
                    <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line"/>}/>
                    <Area dataKey={"rate"} type={"natural"} fill="var(--color-rates)" fillOpacity={0.4} stroke="var(--color-rates)"/> 
                </AreaChart>
            </ChartContainer>

            {/* <Card className="w-full">
                <CardHeader className="p-3">
                    <div className="flex items-center justify-end w-full">
                        <ToggleGroup type="single" defaultValue="1">
                            <ToggleGroupItem value="1" className="text-xs h-5 w-5">1d</ToggleGroupItem>
                            <ToggleGroupItem value="7" className="text-xs h-5 w-5">1w</ToggleGroupItem>
                            <ToggleGroupItem value="30" className="text-xs h-5 w-5">1m</ToggleGroupItem>
                            <ToggleGroupItem value="365" className="text-xs h-5 w-5">1y</ToggleGroupItem>
                        </ToggleGroup>
                    </div>
                </CardHeader>

                <CardContent>
                    
                </CardContent>
            </Card> */}
        </div>
    );
};

export default Chart;