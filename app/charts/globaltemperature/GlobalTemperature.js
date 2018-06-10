import React from 'react'
import * as d3 from 'Helpers/d3'
import {defineDomain, defineScale, getDatumLength,selectGroup, countContinuousDataset} from 'Helpers/helpers'
import ChartWrapper from 'Components/ChartWrapper'
import image from 'GlobalTemperature/assets/desert.jpg'
import style from 'GlobalTemperature/global-temp.scss'

const CHART_MARGIN_X = 100
const CHART_MARGIN_TOP = 50
const CHART_MARGIN_BOTTOM = 100
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
    .range([CHART_MARGIN_TOP,height-CHART_MARGIN_BOTTOM])
    let scaleColor = defineDomain({
      scale:d3.scaleQuantile
      ,dataset:data
      ,dataprop:"variance"
      ,bufferFactor:0
    }).range(COLOR_SCALE)
    let tooltip = d3.select("#tooltip").attr("class","globaltemp").style("opacity",0)

    //heat map
    let svg = d3.select("#chart-svg")
    let chart = svg.selectAll("rect").data(data)
    chart.enter().append("rect")
    .attr("fill",d=>scaleColor(d.variance))
    .merge(chart)
    .attr("x",d=>scaleX(d.year))
    .attr("y",d=>scaleY(d.month))
    .attr("width",getDatumLength(scaleX,countContinuousDataset(data,"year")))
    .attr("height",getDatumLength(scaleY,MONTHS.length))
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
    let x = selectGroup(svg,"x","globaltemp")
    x.attr("transform", `translate(0,${height-CHART_MARGIN_BOTTOM})`)
    .call(axisX)

    let axisY = d3.axisLeft(scaleY)
    .tickFormat(d=>MONTHS[d-1])
    .tickSizeOuter(0)
    let y = selectGroup(svg,"y","globaltemp")
    y.attr("transform",`translate(${CHART_MARGIN_X},0)`)
    .call(axisY)

    //legend
    const MIN_LEGEND_WIDTH = 450
    let legendStart = Math.min(width/4,(width-MIN_LEGEND_WIDTH)/2)
    console.log(width)
    console.log("legendStart",legendStart)
    let breakpoints = scaleColor.quantiles()
    let legendRange= d3.range(breakpoints.length).map(el=>{
      return legendStart + (width-2*legendStart)/breakpoints.length*el
    })
    let scaleLegend = scaleColor.copy().range(legendRange)

    let legend = selectGroup(svg,"legend").selectAll("rect").data(breakpoints)

    legend.enter()
    .append("rect").attr("fill",d=>scaleColor(d))
    .merge(legend)
    .attr("x",d=>scaleLegend(d)).attr("y",height-CHART_MARGIN_BOTTOM/2).attr("height","30px").attr("width",getDatumLength(scaleLegend,breakpoints.length-1))

    let formatLegendTicks = v=>(v+r.baseTemperature).toFixed(1) +"°"
    let axisLegend = d3.axisBottom(scaleLegend)
    .tickValues(breakpoints)
    .tickFormat(formatLegendTicks)
    let xLegend = selectGroup(d3.select("#legend"),"xLegend","globaltemp")
    xLegend.attr("transform",`translate(0,${height-CHART_MARGIN_BOTTOM/2+30})`) // 30 = height of legend color scale
    .call(axisLegend)

    //extend legend axis path
    let legendPath = d3.select("#xLegend").select(".domain")
    let re = /H([0-9.]*)/i
    let currentPathH = legendPath.attr("d").match(re)[1]
    let newPathH = getDatumLength(scaleLegend,breakpoints.length-1) + Number(currentPathH)
    let newPath = legendPath.attr("d").replace(currentPathH,newPathH)
    legendPath.attr("d",newPath)

    //add final tick
    let newBreakpoints = [...breakpoints, (breakpoints[1]-breakpoints[0]+breakpoints[breakpoints.length-1])]
    .map(formatLegendTicks)
    let tickClone = d3.select("#xLegend").select(".tick").select("text")
    let legendTicks = d3.select("#xLegend").selectAll("g").data(newBreakpoints)

    legendTicks.enter()
    .append("g")
    .attr("class","tick").attr("transform",`translate(${newPathH.toFixed(1)},0)`)
    .append("text")
    .text(d=>d).attr("y",tickClone.attr("y")).attr("dy",tickClone.attr("dy"))
  })
}
