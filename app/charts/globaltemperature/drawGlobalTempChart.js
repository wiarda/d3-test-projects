// import style from 'GlobalTemperature/global-temp.scss'

export default function drawGlobalTempChart(dataset,helpers,d3){
  const CHART_MARGIN_LEFT = 100
  const CHART_MARGIN_RIGHT = 50
  const CHART_MARGIN_TOP = 50
  const CHART_MARGIN_BOTTOM = 100
  const COLOR_SCALE = ["#a50026","#d73027","#f46d43","#fdae61","#fee090","#ffffbf","#e0f3f8","#abd9e9","#74add1","#4575b4","#313695"].reverse()
  const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"]
  const {defineDomain, defineScale, getDatumLength,selectAxis, countContinuousDataset} = helpers

  dataset.then(r=> {
    let data = r.monthlyVariance
    let height = document.getElementById("chart-svg").clientHeight
    let width = document.getElementById("chart-svg").clientWidth
    let scaleX = defineScale({
      scale:d3.scaleLinear
      ,dataset:data
      ,dataprop:"year"
      ,bufferFactor:0
      ,rangeStart:CHART_MARGIN_LEFT,
      rangeEnd:width-CHART_MARGIN_RIGHT
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
      tooltip.style("left",`${event.pageX+30}px`)
      .style("top",`${event.pageY-30}px`)
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
    let x = selectAxis(svg,"x","globaltemp")
    x.attr("transform", `translate(0,${height-CHART_MARGIN_BOTTOM})`)
    .call(axisX)

    let axisY = d3.axisLeft(scaleY)
    .tickFormat(d=>MONTHS[d-1])
    .tickSizeOuter(0)
    let y = selectAxis(svg,"y","globaltemp")
    y.attr("transform",`translate(${CHART_MARGIN_LEFT},0)`)
    .call(axisY)

    //legend
    const MIN_LEGEND_WIDTH = 450
    let legendStart = Math.min(width/4,(width-MIN_LEGEND_WIDTH)/2)
    let breakpoints = scaleColor.quantiles()
    let legendRange= d3.range(breakpoints.length).map(el=>{
      return legendStart + (width-2*legendStart)/breakpoints.length*el
    })
    let scaleLegend = scaleColor.copy().range(legendRange)

    let legend = selectAxis(svg,"legend").selectAll("rect").data(breakpoints)

    legend.enter()
    .append("rect").attr("fill",d=>scaleColor(d))
    .merge(legend)
    .attr("x",d=>scaleLegend(d)).attr("y",height-CHART_MARGIN_BOTTOM/2).attr("height","30px").attr("width",getDatumLength(scaleLegend,breakpoints.length-1))

    let formatLegendTicks = v=>(v+r.baseTemperature).toFixed(1) +"°"
    let axisLegend = d3.axisBottom(scaleLegend)
    .tickValues(breakpoints)
    .tickFormat(formatLegendTicks)
    let xLegend = selectAxis(d3.select("#legend"),"xLegend","globaltemp")
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
