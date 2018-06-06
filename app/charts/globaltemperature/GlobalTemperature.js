import React from 'react'
import * as d3 from 'Helpers/d3'
import ChartWrapper from 'Components/ChartWrapper'
import image from 'GlobalTemperature/assets/desert.jpg'

// const CHART_MARGIN_X = 90
// const CHART_MARGIN_Y = 50
// const CIRCLE_SIZE = 7

export default function GlobalTemperature(props){
  return (
    <ChartWrapper
      drawChart={drawGlobalChart}
      img={image}
      titleTextArr={["Average Global Temperature","1753 to 2015"]}
    />
  )
}


function drawGlobalChart(){
  return null
}
