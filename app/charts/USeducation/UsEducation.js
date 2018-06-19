import React from 'react'
import * as d3 from 'Helpers/d3'
import ChartWrapper from 'Components/ChartWrapper'
import * as topojson from 'topojson-client'
import styles from 'Edu/UsEducation.scss'
import {selectElement, selectAxis, defineDomain, getDatumLength, addFinalTick} from 'Helpers/d3Helpers'
import countiesData from 'Edu/assets/countiesData.json'
import eduObj from 'Edu/assets/eduObj.json'

const MARGIN = 50
const MARGIN_BOTTOM = 100
const CHART_CLASS = "edu"
const COLOR_SCALE = ['#feebe2','#fbb4b9','#f768a1','#c51b8a','#7a0177']
const MIN_LEGEND_WIDTH = 450
const LEGEND_HEIGHT = 30

let geoObject, nation, states, counties
let mapData = Promise.resolve(countiesData).then(mapData=>{
  geoObject = topojson.feature(mapData,mapData.objects)
  nation = topojson.feature(mapData,mapData.objects.nation)
  states = topojson.feature(mapData,mapData.objects.states)
  counties = topojson.feature(mapData,mapData.objects.counties)
  return mapData
})
let educationData = Promise.resolve(eduObj)
let data = Promise.all([mapData,educationData])

export default function USEducationChart(props){
  return(
    <ChartWrapper
      data={data}
      drawChart={drawChloropleth}
      img={null}
      titleTextArr={["US Educational Attainment"]}
      subTitle="% population with a bachelor's degree or higher"
      chartFooterMargin={50}
      chartClassName={CHART_CLASS}
      sourcesArray={["United States Department of Agriculture: Economic Research Service"]}
      linksArray={["https://www.ers.usda.gov/data-products/county-level-data-sets/download-data.aspx/"]}
    />
  )
}

function drawChloropleth(data){
data.then(r=>{
  let mapData = r[0]
  let eduData = r[1]

  let svg = d3.select("#chart-svg")
  let height = document.getElementById("chart-svg").clientHeight
  let width = document.getElementById("chart-svg").clientWidth
  let tooltip = d3.select("#tooltip").style("opacity",0)

  let projection = d3.geoIdentity().fitExtent([[MARGIN,MARGIN],[width-MARGIN,height-MARGIN_BOTTOM]],states)
  let path = d3.geoPath().projection(projection)

  //scales
  let scaleColor = defineDomain({
    scale: d3.scaleQuantile
    ,dataset: eduData.range
    ,dataprop: null
    ,bufferFactor: 0
  }).range(COLOR_SCALE)

  //nation
  let nationMap = selectElement(svg,"usa",CHART_CLASS,addPath).select("path")
  .datum({type:"FeatureCollection",features:nation.features})
  .attr("d",path)

  //counties
  let countiesMap = selectElement(svg,"counties",CHART_CLASS).selectAll("path").data(counties.features)
  countiesMap.enter().append("path")
  .attr("fill",d=>scaleColor(eduData[d.id].bachelorsOrHigher))
  .on("mouseover",d=>{
    let info = eduData[d.id]
    tooltip.style("left",`${d3.event.pageX+30}px`)
    .style("top",`${d3.event.pageY-30}px`)
    .html(`${info.area_name}, ${info.state}<br>${info.bachelorsOrHigher}% have a bachelor's degree or higher`)
    tooltip.transition().duration(100).style("opacity",1)
  })
  .on("mouseout",()=>{
    tooltip.style("opacity",0)
    .style("left",-200 + "px").style("top",-200+"px")
  })
  .merge(countiesMap).attr("d",path)

  //states
  let statesMap = selectElement(svg,"states",CHART_CLASS).selectAll("path").data(states.features)
  statesMap.enter().append("path")
  .merge(statesMap).attr("d",path)

  //legend
  let legendStart = Math.max(width/4,(width-MIN_LEGEND_WIDTH)/2)
  let breakpoints = scaleColor.quantiles()
  breakpoints.unshift(breakpoints[0]-(breakpoints[1]-breakpoints[0])) // add first quantile to start of legend
  let legendRange= d3.range(breakpoints.length).map(el=>{
    return legendStart + (width-2*legendStart)/breakpoints.length*el
  })
  let scaleLegend = scaleColor.copy().range(legendRange)

  let legend = selectElement(svg,"legend","edu").selectAll("rect").data(breakpoints)
  legend.enter().append("rect")
  .attr("fill",d=>scaleColor(d)).attr("height", LEGEND_HEIGHT + "px")
  .merge(legend)
  .attr("x",d=>scaleLegend(d)).attr("y",height-MARGIN_BOTTOM/2).attr("width",getDatumLength(scaleLegend,breakpoints.length-1))

  let axisLegend = d3.axisBottom(scaleLegend)
  .tickValues(breakpoints)
  .tickFormat(formatLegendTicks)

  let xLegend = selectAxis(d3.select("#legend"),"xLegend","edu")
  .attr("transform",`translate(0,${height-MARGIN_BOTTOM/2+LEGEND_HEIGHT})`)
  .call(axisLegend)

  // add tickpoint at end of legend
  addFinalTick("#xLegend",scaleLegend,breakpoints,formatLegendTicks)
  })
}

function addPath(el){
  el.append("path")
}

function formatLegendTicks(val){
  return val.toFixed(1) + "%"
}
