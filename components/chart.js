import { withParentSize } from '@vx/responsive'
import { scaleTime, scaleLinear } from '@vx/scale'
import { LinePath } from '@vx/shape'

function Chart({ data, parentWidth, parentHeight }) {

  // Set dimensions
  const margin = {
    top: 15,
    bottom: 40,
    left: 0,
    right: 0
  }
  const width = parentWidth - margin.left - margin.right
  const height = parentHeight - margin.top - margin.bottom

  // Extract data points from data props into x and y axes
  const x = (datapoint) => new Date(datapoint.date)
  const y = (datapoint) => datapoint.price

  // Look through all the times in data props, and get the earliest and latest dates
  const minDate = Math.min(...data.map(x))
  const maxDate = Math.max(...data.map(x))

  // Look through all the prices in data props, and get the minimum and maxmium prices
  const minPrice = Math.min(...data.map(y))
  const maxPrice = Math.max(...data.map(y))

  // Options for x axis scale, with dates
  const xScale = scaleTime({
    range: [0, width], // Axis is drawn from left to right
    domain: [minDate, maxDate]
  })

  // Options for y axis scale, with prices
  const yScale = scaleLinear({
    range: [height, 0], // Axis is drawn from top to bottom
    domain: [minPrice, maxPrice]
  })

  return (
    <div>
      <svg width={width} height={height}>
        {/* Plot the line chart with all options passed in */}
        <LinePath
          data={data}
          xScale={xScale}
          yScale={yScale}
          x={x}
          y={y}
        />
      </svg>
    </div>
  )
}

export default withParentSize(Chart)
