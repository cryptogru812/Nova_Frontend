export interface CustomLineChartProps {
  data: { [key: string]: unknown }[]
  xKey: string
  yKey: string
  width: string
  height: number
  hideXAxis?: boolean
  lineColor?: string
  lineWidth?: number
}
