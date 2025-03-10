"use client"
import {
  Chart,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartXAxis,
  ChartYAxis,
  ChartBar,
} from "./ui/chart"

export default function PerformanceChart() {
  return (
    <ChartContainer className="h-full w-full" data={performanceData}>
      <Chart>
        <ChartXAxis
          dataKey="model"
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => value}
          stroke="#666"
          fontSize={12}
        />
        <ChartYAxis
          tickLine={false}
          axisLine={false}
          stroke="#666"
          fontSize={12}
          tickFormatter={(value) => `${value}s`}
        />
        <ChartTooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <ChartTooltipContent>
                  <div className="font-medium">{payload[0].payload.model}</div>
                  <div className="text-xs text-muted-foreground">Execution Time: {payload[0].value}s</div>
                </ChartTooltipContent>
              )
            }
            return null
          }}
        />
        <ChartBar dataKey="time" radius={[4, 4, 0, 0]} className="fill-yellow-400" />
      </Chart>
    </ChartContainer>
  )
}

const performanceData = [
  {
    model: "TinyLlama",
    time: 1.2,
  },
  {
    model: "TinyDolphin",
    time: 2.5,
  },
  {
    model: "Gemma2 2B",
    time: 4.8,
  },
  {
    model: "Phi 3.7B",
    time: 7.3,
  },
]

