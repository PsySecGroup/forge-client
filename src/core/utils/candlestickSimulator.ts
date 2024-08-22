type CandlestickData = {
  x: string
  o: number
  c: number
  h: number
  l: number
}
/**
 *
 */
function randomNumber(min, max) {
  return Math.random() * (max - min) + min
}

/**
 *
 */
function getMovingAverage (candlestickData: CandlestickData[], interval = 3) {
  // Group data by date (assuming daily data for simplicity)
  const result: { x: number, y: number}[] = []
  const prices: number[] = []

  for (let i = 0; i < candlestickData.length; i++) {
    // Add the current price to the list
    prices.push(candlestickData[i].c);

    // Remove prices outside the interval window
    if (prices.length > interval) {
      prices.shift(); // Removes the oldest price
    }

    // Calculate the average if we have enough data
    if (prices.length === interval) {
      const sum = prices.reduce((acc, price) => acc + price, 0);
      result.push({
        x: candlestickData[i].x,
        y: sum / interval
      });
    }
  }

  return result
}

/**
 *
 */
export function candlestickSimulator (minutes = 10, movingAverageInterval = 3, multiplier = 1): { bars: CandlestickData[], line: { x: string, y:number }[] }  {
  const past = new Date(Date.now() - minutes * 60 * 1000)
  const bars = []

  let lastClose = 1 * multiplier

  for (let i = 0; i < minutes; i++) {
    const x = past.getTime()
    const open = +randomNumber(lastClose * 0.95, lastClose * 1.05).toFixed(2)
    const close = +randomNumber(open * 0.95, open * 1.05).toFixed(2)
    const high = +randomNumber(Math.max(open, close), Math.max(open, close) * 1.1).toFixed(2)
    const low = +randomNumber(Math.min(open, close) * 0.9, Math.min(open, close)).toFixed(2)

    lastClose = close

    bars.push({
      x,
      o: open,
      c: close,
      h: high,
      l: low
    })

    past.setMinutes(past.getMinutes() + 1)
  }

  return {
    bars,
    line: getMovingAverage(bars, movingAverageInterval)
  }
}
