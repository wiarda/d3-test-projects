import React from 'react'
import ChartWrapper from 'Components/ChartWrapper'
import movieData from 'Movies/assets/movieData.json'
import img from 'Movies/assets/movie-bg2.jpg'
import styles from './TopMovies.scss'
import * as d3 from 'Helpers/d3'
import {selectElement} from 'Helpers/d3Helpers'
import * as d3plus from 'd3plus-text'

const CHART_CLASS = "movies"
const CHART_MARGIN = 10
const COLOR_SCHEME = ['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f']
const COLOR_SCHEME_2 = COLOR_SCHEME.map(color=>{
  return d3.interpolate(color,"white")(0.25)
})

export default function TopMovies(props){
  return (
    <ChartWrapper
      data={Promise.resolve(movieData)}
      drawChart={drawTreeMap}
      img={img}
      titleTextArr={["Top Grossing Movies"]}
      subTitle={null}
      chartFooterMargin={50}
      chartClassName={CHART_CLASS}
      sourcesArray={["Wikipedia: List of Highest-Grossing Films"]}
      linksArray={["https://en.wikipedia.org/wiki/List_of_highest-grossing_films"]}
    />
  )
}


function drawTreeMap(data){
  data.then(r=>{
    let svg = d3.select("#chart-svg")
    let height = document.getElementById("chart-svg").clientHeight
    let width = document.getElementById("chart-svg").clientWidth
    let tooltip = d3.select("#tooltip").style("opacity",0)
    let categories = r.children.map(el=>el.name)

    let color = d3.scaleOrdinal()
    .domain(categories)
    .range(COLOR_SCHEME_2)

    let catColor = color.copy()
    .range(COLOR_SCHEME)

    let root = d3.hierarchy(r)
    root.sum(d=>d.value)

    let treemapLayout = d3.treemap()
    .size([width-2*CHART_MARGIN,height-2*CHART_MARGIN])
    .paddingOuter(5)
    .paddingTop(20)
    .paddingInner(2)
    .round(true)
    .tile(d3.treemapResquarify)

    treemapLayout(root)

    //nodes
    let treemap = selectElement(svg,"treemap",CHART_CLASS,el=>{
      el.attr("transform",`translate(${CHART_MARGIN},${CHART_MARGIN})`)
    })
    .selectAll("g").data(root.descendants())
    let treemapEntered = treemap.enter()
    .append("g")
    treemapEntered.merge(treemap)
    .attr("transform",d=>`translate(${d.x0},${d.y0})`)

    //leaves
    treemapEntered.append("rect")
    .attr("fill", d=>{
      switch (d.depth) {
        case 0:
        return "cornsilk"
        case 1:
        return catColor(d.data.name)
        default:
        return color(d.data.category)
      }
    })
    treemapEntered.merge(treemap).select("rect")
    .attr("width",d=>d.x1-d.x0)
    .attr("height",d=>d.y1-d.y0)

    //leaf titles
    d3.select("#treemap").selectAll("g")
    .each(function(d){
      let width = d.x1-d.x0
      let height = d.depth < 2 ? 20 : d.y1-d.y0
      new d3plus.TextBox()
        .data([{text:d.data.name,height,width}])
        .fontResize(true)
        .fontMax(12)
        .select(this)
        .padding(2)
        .render()
    })
    
  })
}
