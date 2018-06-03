import React from 'react'
import {throttleResize, secondsToMinutes} from 'Helpers/helpers'
import * as d3 from 'Helpers/d3'
import Chart from 'Components/Chart'
import Background from 'Components/Background'
import Title from 'Components/Title'
import img from 'TDF/assets/tour-de-france-d3-scatter-plot-bg.jpg'


const CHART_MARGIN_X = 90
const CHART_MARGIN_Y = 50
const CIRCLE_SIZE = 7

let data = fetch("https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json")
.then(r=>r.json())

throttleResize(500)

export default class App extends React.Component{
  constructor(props){
    super(props)
    this.state = {height:null}
    this.deriveChartHeight = this.deriveChartHeight.bind(this)
  }

  componentDidMount(){
    this.deriveChartHeight()
    drawForceChart.bind(this)()
    window.addEventListener("optimizedResize",function(){
      this.deriveChartHeight()
    }.bind(this))
  }

  componentDidUpdate(){
    drawForceChart.bind(this)()
  }

  deriveChartHeight(){
    let height = window.innerHeight - document.getElementById("title-box").clientHeight - CHART_MARGIN_Y
    this.setState({height:height})
  }

  render(){
    return(
    <React.Fragment>

      <Background
        img={img}
      />

      <Chart height={this.state.height}>
        <Title
          titleText={["Doping at","Le Tour de France"]}
          titleBoxPadding={40}
        />
      </Chart>

    </React.Fragment>
    )
  }
}

function drawForceChart(){
  data.then( function(data){
    let svg = d3.select("#chart-svg")
    let height = document.getElementById("chart-svg").clientHeight
    let width = document.getElementById("chart-svg").clientWidth
    let tooltip = d3.select("body").append("div").attr("class","tooltip")
    .style("opacity",0)

    let xMin = d3.min(data,d=>d.Year)
    let xMax = d3.max(data,d=>d.Year)
    let xDomainBuffer = Math.round( (xMax - xMin)/10 )

    let yMin = d3.min(data,d=>d.Seconds)
    let yMax = d3.max(data,d=>d.Seconds)
    let yDomainBuffer = Math.round( (yMax- yMin)/10 )

    let scaleX = d3.scaleTime()
    .domain([xMin-xDomainBuffer,xMax+xDomainBuffer])
    .range([CHART_MARGIN_X,width-CHART_MARGIN_X])

    let scaleY = d3.scaleTime()
    .domain([yMin-yDomainBuffer,yMax+yDomainBuffer])
    .range([CHART_MARGIN_Y,height-CHART_MARGIN_Y])

    let axisX = d3.axisBottom(scaleX)
    .ticks(5)
    .tickFormat(d3.format(""))
    .tickSizeOuter(0)

    let axisY = d3.axisLeft(scaleY)
    .tickValues(d3.range(2400,2160,-30))
    .tickFormat(secondsToMinutes)
    .tickSizeOuter(0)

    let nodes = data.map(el=>{
      let node = {}
      Object.assign(node,el)
      node.x = scaleX(el.Year)
      node.y = scaleY(el.Seconds)
      return node
    })

    let simulation = d3.forceSimulation(nodes)
    .force('collision',d3.forceCollide().radius(CIRCLE_SIZE))
    .on('tick',renderChart)

    function renderChart(){
      let chart = svg.selectAll('circle').data(nodes)

      chart.enter()
      .append('circle')
      .attr("r", CIRCLE_SIZE)
      .attr("fill", d=>d.Doping? "rgb(249, 86, 16)" : "rgb(8, 232, 158)")
      .on("mouseover",function(d){
        tooltip.style("left",d3.event.pageX + 30 +"px")
        .style("top",d3.event.pageY -30 +"px")
        .html(d.Name +"<br>" + (d.Doping ? d.Doping : "No allegations of doping.") )
        tooltip.transition().duration(500)
        .style("opacity",1)
      })
      .on("mouseout",function(){
        tooltip.transition().duration(500)
        .style("opacity",0)
      })
      .merge(chart)
      .attr("cx", d=>d.x)
      .attr("cy", d=>d.y)
    }

    let xAxis
    if (document.getElementById("x-axis")) xAxis = d3.select("#x-axis")
    else {
      xAxis = svg.append("g")
      .style("font","bold 1rem arial")
      .attr("id","x-axis")
    }
    xAxis
      .attr("transform", `translate(0,${height-CHART_MARGIN_Y})`)
      .call(axisX)

    let yAxis
    if (document.getElementById("y-axis")) yAxis = d3.select("#y-axis")
    else {
      yAxis = svg.append("g")
        .style("font","bold 1rem arial")
        .attr("id","y-axis")
      yAxis
        .append("text")
        .attr("y",CHART_MARGIN_Y/2)
        .attr("x",CHART_MARGIN_X/2)
        .text("Finish Time")
    }
    yAxis
      .attr("transform",`translate(${CHART_MARGIN_X},0)`)
      .call(axisY)

    let chartTitle
    if (document.getElementById("chart-title")) chartTitle = d3.select("#chart-title")
    else{
      chartTitle = svg.append("text")
      .text("Top 35 Records for Alpe D'Huez")
      .attr("id","chart-title")
      .style("font-size","2rem")
    }
    chartTitle
    .attr("x",width/2-210)
    .attr("y",CHART_MARGIN_Y)

  }.bind(this))
}
