import React from 'react'
import * as d3 from 'Helpers/d3'
import ChartWrapper from 'Components/ChartWrapper'

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
      chartClassName="edu"
      sourcesArray={["United States Department of Agriculture: Economic Research Service"]}
      linksArray={["https://www.ers.usda.gov/data-products/county-level-data-sets/download-data.aspx/"]}
    />
  )
}

function drawChloropleth(data){
data.then(r=>{
  let mapData = r[0]
  let eduData = r[1]
  console.log(mapData)

  let svg = d3.select("#chart-svg")
  let height = document.getElementById("chart-svg").clientHeight
  let width = document.getElementById("chart-svg").clientWidth
  let tooltip = d3.select("#tooltip").attr("class","tooltip").attr("id","tooltip")
  .style("opacity",0)

  let projection = d3.geoAlbersUsa()
  .translate([width/2,height/2])
  let path = d3.geoPath().projection(projection)

  svg.append("path").datum({type:"MultiPolygon",geometries:mapData.objects.nation.geometries[0].arcs})
  .attr("d",path)



  })
}
