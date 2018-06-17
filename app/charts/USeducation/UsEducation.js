import React from 'react'
import * as d3 from 'Helpers/d3'
import ChartWrapper from 'Components/ChartWrapper'
import * as topojson from 'topojson-client'
import styles from 'Edu/UsEducation.scss'
import {selectElement} from 'Helpers/d3Helpers'

const MARGIN = 50
const CHART_CLASS = "edu"

let counties = fetch("https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json").then(r=>r.json())
let education = fetch("https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json").then(r=>r.json())
let data = Promise.all([counties,education])

export default function USEducationChart(props){
  return(
    <ChartWrapper
      data={data}
      drawChart={drawChloropleth}
      img={null}
      titleTextArr={["US Education Levels"]}
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

  let geoObject = topojson.feature(mapData,mapData.objects)
  let nation = topojson.feature(mapData,mapData.objects.nation)
  let states = topojson.feature(mapData,mapData.objects.states)
  let counties = topojson.feature(mapData,mapData.objects.counties)
  let projection = d3.geoIdentity().fitExtent([[MARGIN,MARGIN],[width-MARGIN,height-MARGIN]],states)
  let path = d3.geoPath().projection(projection)

  console.log(states)

  //nation
  let nationMap = selectElement(svg,"usa",CHART_CLASS,addPath).select("path")
  .datum({type:"FeatureCollection",features:nation.features})
  .attr("d",path)

  //states
  let statesMap = selectElement(svg,"states",CHART_CLASS).selectAll("path").data(states.features)
  statesMap.enter().append("path")
  .merge(statesMap).attr("d",path)

  //counties
  let countiesMap = selectElement(svg,"counties",CHART_CLASS).selectAll("path").data(counties.features)
  countiesMap.enter().append("path")
  .merge(countiesMap).attr("d",path)



  })
}

function addPath(el){
  el.append("path")
}
