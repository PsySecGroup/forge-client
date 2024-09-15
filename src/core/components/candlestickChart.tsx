import * as Luxon from 'chartjs-adapter-luxon'
import Chart from 'chart.js/auto'
import { onCleanup, onMount } from 'solid-js'
import useTheme from '@suid/material/styles/useTheme'
import { OhlcElement, OhlcController, CandlestickElement, CandlestickController } from 'chartjs-chart-financial'
import { mergeStyle } from '../utils/style'
import { candlestickSimulator } from '../utils/candlestickSimulator'

Chart.register(Luxon, OhlcElement, OhlcController, CandlestickElement, CandlestickController)

export type CandlestickData = {
  x: string
  o: number
  c: number
  h: number
  l: number
}

interface Props extends ParentProps {
  xAxisLabel: string
  yAxisLabel: string
  xData: CandlestickData[]
  yData: CandlestickData
  width?: number
  height?: number
  backgroundColor?: string
  yDataLabel?: string
  xDataLabel?: string
  xLabelColor?: string
  yLabelColor?: string
  xBorderColor?: string
  upColor?: string
  downColor?: string
  unchangedColor?: string
  yBorderColor?: string
  timeWindow?: number
  getMovingAverage?: number
  style?: Style
  classes?: Class
}

function CandlestickChart(props: Props = {}) {
  // Styling
  const theme = useTheme()
  const { style, classes } = mergeStyle(
    props,
    undefined,
    {
      width: `${props.width}px`,
      height: `${props.height}px`,
      background: theme.palette.secondary.background,
      color: theme.palette.secondary.text
    }
  )

  // State
  const {
    timeWindow = 50,
    getMovingAverage = 6,
    width = 1000,
    height = 600,
    backgroundColor,
    xAxisLabel,
    xData,
    xDataLabel,
    xBorderColor,
    xLabelColor,
    yAxisLabel, 
    yData,
    yDataLabel,
    yBorderColor,
    yLabelColor,
    upColor,
    downColor,
    unchangedColor
  } = props
  const prices = candlestickSimulator(timeWindow, getMovingAverage, 25)
  let chartRef

  // Rendering
  onMount(() => {
    const ctx = chartRef.getContext('2d')
    ctx.canvas.width = width
    ctx.canvas.height = height

    const data = {
      datasets: [{
        label: yDataLabel || yAxisLabel,
        data: yData,
        type: 'candlestick',
        borderColor: yBorderColor || 'rgba(0, 0, 0, 1)',
        backgroundColor: yLabelColor || 'rgba(75, 192, 192, 0.2)',
        color: {
          up: upColor || 'rgba(0, 255, 0, 1)',
          down: downColor || 'rgba(255, 0, 0, 1)',
          unchanged: unchangedColor || 'rgba(0, 0, 255, 1)',
        },
      }, {
        label: xDataLabel || xAxisLabel,
        data: xData,
        type: 'line',
        borderColor: xBorderColor,
        backgroundColor: xLabelColor || 'rgba(75, 92, 192, 0.2)',
        fill: false,
      }],
    };

    const config = {
      type: 'candlestick',
      data: data,
      plugins: [{
        id: 'backgroundColorPlugin',
        beforeDraw: (chart, args) => {
          const {ctx} = chart
          ctx.save()
          ctx.globalCompositeOperation = 'destination-over'
          ctx.fillStyle = backgroundColor || theme.palette.secondary.background
          ctx.fillRect(0, 0, chart.width, chart.height)
          ctx.restore()
        }
      }],
      options: {
        responsive: true,
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'minute',
            },
            title: {
              display: true,
              text: xAxisLabel,
            },
          },
          y: {
            title: {
              display: true,
              text: yAxisLabel,
            },
          },
        },
      },
    }

    const myChart = new Chart(ctx, config)

    onCleanup(() => {
      myChart.destroy()
    })
  })

  return (
    <div
      class={classes}
      style={style}
    >
      <canvas ref={chartRef} />
    </div>
  )
}

export default CandlestickChart
