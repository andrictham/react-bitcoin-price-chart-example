import { withParentSize } from "@vx/responsive"
import { scaleTime, scaleLinear } from "@vx/scale"
import { LinePath, AreaClosed } from "@vx/shape"
import { LinearGradient } from "@vx/gradient"

import MaxPrice from "./maxprice"

function Chart({ data, parentWidth, parentHeight }) {
	// Set dimensions
	const margin = {
		top: 15,
		bottom: 40,
		left: 0,
		right: 0,
	}
	const width = parentWidth - margin.left - margin.right
	const height = parentHeight - margin.top - margin.bottom

	// Extract data points from data props into x and y axes
	const x = datapoint => new Date(datapoint.date)
	const y = datapoint => datapoint.price

	// Get the first and last data points
	const firstPoint = data[0]
	const currentPoint = data[data.length - 1]

	// Look through all the times in data props, and get the earliest and latest dates
	const minDate = Math.min(...data.map(x))
	const maxDate = Math.max(...data.map(x))

	// Look through all the prices in data props, and get the minimum and maxmium prices
	const minPrice = Math.min(...data.map(y))
	const maxPrice = Math.max(...data.map(y))

	// Compute a line that goes horizontally from the earliest to the latest date, that’s straight across on the y-axis indicating the all-time-high
	const maxPriceData = [
		{
			date: x(firstPoint),
			price: maxPrice,
		},
		{
			date: x(currentPoint),
			price: maxPrice,
		},
	]

	console.log(maxPriceData)

	// Options for x axis scale, with dates
	const xScale = scaleTime({
		range: [0, width], // Axis is drawn from left to right
		domain: [minDate, maxDate],
	})

	// Options for y axis scale, with prices
	const yScale = scaleLinear({
		range: [height, 0], // Axis is drawn from top to bottom
		domain: [minPrice, maxPrice],
	})

	return (
		<div>
			<svg width={width} height={height}>
				<LinearGradient
					id="area-fill"
					from="#4682B4"
					to="#4682B4"
					fromOpacity={0.3}
					toOpacity={0}
				/>
				<MaxPrice
					data={maxPriceData}
					yScale={yScale}
					xScale={xScale}
					x={x}
					y={y}
					label={maxPrice}
					yText={0}
				/>
				{/* Plot the line chart and area chart with all options passed in */}
				<AreaClosed
					data={data}
					xScale={xScale}
					yScale={yScale}
					x={x}
					y={y}
					fill="url(#area-fill)"
					stroke="transparent"
				/>
				<LinePath data={data} xScale={xScale} yScale={yScale} x={x} y={y} />
			</svg>
		</div>
	)
}

export default withParentSize(Chart)
