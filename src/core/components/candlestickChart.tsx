import { onCleanup, onMount } from 'solid-js'
import { OhlcElement, OhlcController, CandlestickElement, CandlestickController } from 'chartjs-chart-financial'
import * as Luxon from 'chartjs-adapter-luxon'
import Chart from 'chart.js/auto'
import { candlestickSimulator } from '../utils/candlestickSimulator'

Chart.register(Luxon, OhlcElement, OhlcController, CandlestickElement, CandlestickController)

function CandlestickChart({ timeWindow = 50, getMovingAverage = 6, width = 1000, height = 600 }) {
  let chartRef
  const prices = candlestickSimulator(timeWindow, getMovingAverage, 25)
  // TODO data and moving averages are state
  onMount(() => {
    const ctx = chartRef.getContext('2d')
    ctx.canvas.width = width
    ctx.canvas.height = height

    const data = {
      datasets: [{
        label: 'Price Per Credit',
        data: prices.bars,
        type: 'candlestick',
        borderColor: 'rgba(0, 0, 0, 1)',
        color: {
          up: 'rgba(0, 255, 0, 1)',
          down: 'rgba(255, 0, 0, 1)',
          unchanged: 'rgba(0, 0, 255, 1)',
        },
      }, {
        label: `${getMovingAverage} Minute Moving Average`,
        data: prices.line,
        type: 'line',
        borderColor: 'rgba(0, 0, 255, 0.8)',
        fill: false,
      }],
    };

    const config = {
      type: 'candlestick',
      data: data,
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
              text: `Time (${timeWindow} minute blocks)`,
            },
          },
          y: {
            title: {
              display: true,
              text: 'Price (USD)',
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
    <div style={{
      width: `${width}px`,
      height: `${height}px`
    }}>
      <canvas ref={chartRef} />
    </div>
  )
}

export default CandlestickChart
