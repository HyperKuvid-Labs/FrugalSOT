import type React from "react"
import { ResponsiveContainer, ComposedChart, XAxis, YAxis, Tooltip, Legend, Bar, Line } from "recharts"

interface ChartContainerProps {
  children: React.ReactNode
  data: any[]
  className?: string
}

export function ChartContainer({ children, data, className }: ChartContainerProps) {
  return (
    <ResponsiveContainer width="100%" height={300} className={className}>
      <ComposedChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        {children}
      </ComposedChart>
    </ResponsiveContainer>
  )
}

interface ChartXAxisProps {
  dataKey: string
  tickLine?: boolean
  axisLine?: boolean
  stroke?: string
  fontSize?: number
  tickFormatter?: (value: any) => string
}

export function ChartXAxis({ dataKey, tickLine, axisLine, stroke, fontSize, tickFormatter }: ChartXAxisProps) {
  return (
    <XAxis
      dataKey={dataKey}
      tickLine={tickLine}
      axisLine={axisLine}
      stroke={stroke}
      fontSize={fontSize}
      tickFormatter={tickFormatter}
    />
  )
}

interface ChartYAxisProps {
  tickLine?: boolean
  axisLine?: boolean
  stroke?: string
  fontSize?: number
  tickFormatter?: (value: any) => string
}

export function ChartYAxis({ tickLine, axisLine, stroke, fontSize, tickFormatter }: ChartYAxisProps) {
  return (
    <YAxis tickLine={tickLine} axisLine={axisLine} stroke={stroke} fontSize={fontSize} tickFormatter={tickFormatter} />
  )
}

interface ChartTooltipProps {
  content: React.FC<any>
}

export function ChartTooltip({ content }: ChartTooltipProps) {
  return <Tooltip content={content} />
}

export function ChartTooltipContent({ children }: { children: React.ReactNode }) {
  return <div className="bg-zinc-900 border border-zinc-800 rounded-md p-2">{children}</div>
}

interface ChartBarProps {
  dataKey: string
  radius?: number[]
  className?: string
}

export function ChartBar({ dataKey, radius, className }: ChartBarProps) {
  return <Bar dataKey={dataKey} radius={radius} className={className} />
}

interface ChartLineProps {
  dataKey: string
  stroke: string
  strokeWidth: number
  activeDot?: { r: number; fill: string }
}

export function ChartLine({ dataKey, stroke, strokeWidth, activeDot }: ChartLineProps) {
  return <Line type="monotone" dataKey={dataKey} stroke={stroke} strokeWidth={strokeWidth} activeDot={activeDot} />
}

interface ChartLegendProps {
  payload: { value: string; color: string }[]
}

export function ChartLegend({ payload }: ChartLegendProps) {
  return (
    <Legend
      payload={payload.map((item) => ({
        value: item.value,
        type: "line",
        id: item.value,
        color: item.color,
      }))}
    />
  )
}

export function Chart({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

