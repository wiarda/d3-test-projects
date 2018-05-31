import React from 'react'
import * as d3 from 'd3'
import Chart from 'Components/Chart'
import Background from 'Components/Background'
import Title from 'Components/Title'
import img from 'TDF/assets/tour-de-france-d3-scatter-plot-bg.jpg'

const CHART_MARGIN_X = 90
const CHART_MARGIN_Y = 50
const CIRCLE_SIZE = 7

let data = fetch("https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json")
.then(r=>r.json())


export default class App extends React.Component{
  constructor(props){
    super(props)
    this.state = {height:null}
    this.deriveChartHeight = this.deriveChartHeight.bind(this)
  }

  componentDidMount(){
    this.deriveChartHeight()
    drawChart.bind(this)()
    window.addEventListener("resize",function(){
      this.deriveChartHeight()
    }.bind(this))
  }

  componentDidUpdate(){
    resizeChart.bind(this)()
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


function secondsToMinutes(seconds){
  let mins = Math.floor(seconds / 60)
  let secs = (seconds % 60)
  secs = String(secs).length === 1 ? '0' + String(secs) : secs
  return `${mins}:${secs}`
}

function drawChart(){
  data.then( function(data){
    let svg = d3.select("#chart-svg").attr("height",this.state.height)
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
    .range([CHART_MARGIN_Y,this.state.height-CHART_MARGIN_Y])

    let axisX = d3.axisBottom(scaleX).tickFormat(d3.format(""))
    let axisY = d3.axisLeft(scaleY).tickFormat(secondsToMinutes)

    svg.selectAll("circle").data(data).enter()
      .append("circle")
      .attr("r", CIRCLE_SIZE)
      .attr("cx", d=>scaleX(d.Year))
      .attr("cy", d=>scaleY(d.Seconds))
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

    let xAxis = svg.append("g")
      .style("font","bold 1rem arial")
      .attr("id","x-axis")
      .attr("transform", `translate(0,${this.state.height-CHART_MARGIN_Y})`)
      .call(axisX)

    let yAxis = svg.append("g")
      .style("font","bold 1rem arial")
      .attr("id","y-axis")
      .attr("transform",`translate(${CHART_MARGIN_X},0)`)
      .call(axisY)
      .append("text")
      .attr("y",CHART_MARGIN_Y/2)
      .attr("x",CHART_MARGIN_X/2)
      .text("Finish Time")

    svg.append("text")
    .text("Top 35 Records for Alpe D'Huez")
    .attr("x",width/2-210)
    .attr("y",CHART_MARGIN_Y)
    .attr("id","chart-title")
    .style("font-size","2rem")

    xAxis.selectAll("text").style("font-size","1 rem")

  }.bind(this))
}

function resizeChart(svg){
  data.then( function(data){
    let svg = d3.select("#chart-svg").attr("height",this.state.height)
    let width = document.getElementById("chart-svg").clientWidth

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
    .range([CHART_MARGIN_Y,this.state.height-CHART_MARGIN_Y])

    let axisX = d3.axisBottom(scaleX).tickFormat(d3.format(""))
    let axisY = d3.axisLeft(scaleY).tickFormat(secondsToMinutes)

    svg.selectAll("circle").data(data)
      .attr("cx", d=>scaleX(d.Year))
      .attr("cy", d=>scaleY(d.Seconds))

    d3.select("#x-axis")
      .attr("transform", `translate(0,${this.state.height-CHART_MARGIN_Y})`)
      .call(axisX)

    d3.select("#y-axis")
      .attr("transform",`translate(${CHART_MARGIN_X},0)`)
      .call(axisY)

    d3.select("#chart-title")
    .attr("x",width/2-210)

  }.bind(this))
}
