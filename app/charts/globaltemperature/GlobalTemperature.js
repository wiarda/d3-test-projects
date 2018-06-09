import React from 'react'
import * as d3 from 'Helpers/d3'
import {defineDomain, defineScale, getAxisLength,addAxisElement} from 'Helpers/helpers'
import ChartWrapper from 'Components/ChartWrapper'
import image from 'GlobalTemperature/assets/desert.jpg'
import style from 'GlobalTemperature/global-temp.scss'

const CHART_MARGIN_X = 100
const CHART_MARGIN_Y = 50
const COLOR_SCALE = ["#a50026","#d73027","#f46d43","#fdae61","#fee090","#ffffbf","#e0f3f8","#abd9e9","#74add1","#4575b4","#313695"].reverse()
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"]

let data = fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json").then(r=>r.json())

export default function GlobalTemperature(props){
  return (
    <ChartWrapper
      drawChart={drawGlobalTemp}
      img={image}
      titleTextArr={["Average Global Temperature","1753 to 2015"]}
    />
  )
}


function drawGlobalTemp(){
  data.then(r=> {
    let data = r.monthlyVariance
    let height = document.getElementById("chart-svg").clientHeight
    let width = document.getElementById("chart-svg").clientWidth
    let scaleX = defineScale({
      scale:d3.scaleLinear
      ,dataset:data
      ,dataprop:"year"
      ,bufferFactor:0
      ,rangeStart:CHART_MARGIN_X,
      rangeEnd:width-CHART_MARGIN_X
    })
    let scaleY = d3.scaleBand().domain([1,2,3,4,5,6,7,8,9,10,11,12])
    .range([CHART_MARGIN_Y,height-CHART_MARGIN_Y])
    let scaleColor = defineDomain({
      scale:d3.scaleQuantize
      ,dataset:data
      ,dataprop:"variance"
      ,bufferFactor:0
    }).range(COLOR_SCALE)
    let svg = d3.select("#chart-svg")
    let chart = svg.selectAll("rect").data(data)
    let tooltip = d3.select("#tooltip").attr("class","globaltemp").style("opacity",0)

    //heat map
    chart.enter().append("rect")
    .attr("fill",d=>scaleColor(d.variance))
    .merge(chart)
    .attr("x",d=>scaleX(d.year))
    .attr("y",d=>scaleY(d.month))
    .attr("width",getAxisLength(scaleX))
    .attr("height",getAxisLength(scaleY))
    .on("mouseover",d=>{
      tooltip.style("left",`${d3.event.pageX+30}px`)
      .style("top",`${d3.event.pageY-30}px`)
      .html(`${MONTHS[d.month-1]}, ${d.year}<br>${(8.66+d.variance).toFixed(1)} degrees celcius`)
      tooltip.transition().duration(500).style("opacity",1)
    })
    .on("mouseout",d=>{
      tooltip.style("opacity",0)
      .style("left",-200 + "px").style("top",-200+"px")
    })

    // axes
    let axisX = d3.axisBottom(scaleX)
    .tickValues(d3.range(1760,2060,50))
    .tickFormat(d3.format(""))
    .tickSizeOuter(0)
    let x = addAxisElement(svg,"x","globaltemp")

    x.attr("transform", `translate(0,${height-CHART_MARGIN_Y})`)
    .call(axisX)

    let axisScaleY = scaleY.copy().range
    let axisY = d3.axisLeft(scaleY)
    .tickFormat(d=>MONTHS[d-1])
    .tickSizeOuter(0)
    let y = addAxisElement(svg,"y","globaltemp")

    y.attr("transform",`translate(${CHART_MARGIN_X},0)`)
    .call(axisY)





  })
}
