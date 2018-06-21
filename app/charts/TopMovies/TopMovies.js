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
const TITLE_MAX_FONT = 40
const LEAF_MAX_FONT = 12

export default function TopMovies(props){
  return (
    <ChartWrapper
      data={Promise.resolve(movieData)}
      drawChart={drawTreeMap}
      img={img}
      titleTextArr={["Top grossing movies","by category"]}
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


    drawOuter()

    // drawInner("Action")


    //inner functions

    function drawInner(category){
      let children = r.children.filter(child=>child.name==category)
      let expandedData = {name:"Movies", children}
      initializeTreemap(expandedData,"expanded")
      d3.selectAll(".category").each(function(){
        d3.select(this)
        .on("click",drawOuter)
      })
    }

    function drawOuter(){
      initializeTreemap(r,"leaf")
      d3.selectAll(".category").each(function(d){
        d3.select(this)
        .on("click",function(d){
          drawInner(d.data.name)
        })
      })
    }

    function initializeTreemap(nodes, leafStyle){
      let lastMap = document.getElementById("treemap")
      if (lastMap) lastMap.remove() // clear chart DOM for rerender

      //treemap setup
      let root = d3.hierarchy(nodes)
      root.sum(d=>d.value)
      let treemapLayout = d3.treemap()
      .size([width-2*CHART_MARGIN,height-2*CHART_MARGIN])
      .paddingOuter(5)
      .paddingTop(25)
      .paddingInner(2)
      .round(true)
      .tile(d3.treemapResquarify)
      treemapLayout(root)

      //root node
      let rootNode = selectElement(svg,"treemap",CHART_CLASS,el=>{
        el.attr("transform",`translate(${CHART_MARGIN},${CHART_MARGIN})`)
      })
      .datum(root)
      .attr("class", "treemap-root")
      rootNode.append("rect")
      .attr("fill","cornsilk")
      .attr("width",d=>d.x1-d.x0)
      .attr("height",d=>d.y1-d.y0)
      rootNode.each(function(d){
        addTitle.bind(this)(d,TITLE_MAX_FONT)
      })

      //branches
      let branches = rootNode.selectAll("g.category").data(root.children)
      branches.enter().append("g")
      .attr("id",d=>d.data.name)
      .attr("transform",d=>`translate(${d.x0},${d.y0})`)
      .attr("class",d=>`${d.data.name} category`)
      .on("mouseover",function(d){
        d3.select(this).selectAll(".leaf")
        .transition().duration(500)
        .style("opacity",1)
        d3.selectAll(`#${this.id} > .d3plus-textBox text`)
        .transition().duration(500)
        .style("fill",catColor(d.data.name))
      })
      .on("mouseout",function(d){
        d3.select(this).selectAll(".leaf")
        .transition().duration(500)
        .style("opacity",0)
        d3.select(`#${this.id} > .d3plus-textBox text`)
        .transition().duration(500)
        .style("fill","black")
      })
      .append("rect")
      .attr("fill",d=>catColor(d.data.name))
      .attr("width",d=>d.x1-d.x0)
      .attr("height",d=>d.y1-d.y0)
      d3.selectAll("g.category").each(function(d){
        addTitle.bind(this)(d,TITLE_MAX_FONT)
      })

      //leaves
      d3.selectAll(".category").each(function(d){
        let xOffset = d.x0, yOffset = d.y0
        let children = d3.select(this).selectAll(`g.${leafStyle}`)
        .data(d.children)
        children.enter().append("g")
        .attr("id",d=>d.data.name.split(" ").join(""))
        .attr("class",d=>`${d.data.category} ${leafStyle}`)
        .attr("transform",d=>`translate(${d.x0-xOffset},${d.y0-yOffset})`)
        .append("rect")
        .attr("fill",d=>color(d.data.category))
        .attr("width",d=>d.x1-d.x0)
        .attr("height",d=>d.y1-d.y0)
        // console.log(this,d)
        d3.select(this).selectAll(`.${leafStyle}`).each(function(d){
          addTitle.bind(this)(d,LEAF_MAX_FONT)
        })

      })

      function addTitle(d,maxFontSize){
        let width = d.x1-d.x0
        let height = d.depth ? d.y1-d.y0 : 30 // keep node title height in visible space
        new d3plus.TextBox()
          .data([{text:d.data.name,height,width}])
          .fontResize(true)
          .fontMax(maxFontSize)
          .select(this)
          .padding(2)
          .verticalAlign("middle")
          .render()
      }
    } //end initializeTreemap

  })
}
