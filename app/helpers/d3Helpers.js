'use strict'
import * as d3 from 'Helpers/d3'

export function defineScale({scale,dataset,dataprop,bufferFactor,rangeStart,rangeEnd}){
  return defineDomain({scale,dataset,dataprop,bufferFactor})
  .range([rangeStart,rangeEnd])
}

export function defineDomain({scale,dataset,dataprop=null,bufferFactor=null}){
  let min = dataprop ? d3.min(dataset,d=>d[dataprop]) : d3.min(dataset,d=>d)
  let max = dataprop? d3.max(dataset,d=>d[dataprop]) : d3.max(dataset,d=>d)
  let buffer = bufferFactor ? Math.round((max-min)/bufferFactor):0
  return scale().domain([min-buffer,max+buffer])
}

export function getDatumLength(scale,count){
  return ( d3.max(scale.range()) - d3.min(scale.range()) +1 )  / count
}

export function countContinuousDataset(dataset,dataprop){
  return d3.max(dataset,d=>d[dataprop]) - d3.min(dataset,d=>d[dataprop]) + 1
}

export function selectAxis(parent,id,className=null){
  return selectElement(parent,id,className,el=>el.append("text").attr("id",`${id}-title`).attr("class",className))
}

export function selectElement(parent,id,className=null,initFn=null){
  if (d3.select("#"+id).empty()){
    let el = parent.append("g").attr("id",id).attr("class",className)
    if (initFn) initFn(el)
  }
  return d3.select("#"+id)
}

export function addFinalTick(id,scaleLegend,breakpoints,formatLegendTicks=null){
  let legendPath = d3.select(id).select(".domain")
  let re = /H([0-9.]*)/i
  let currentPathH = legendPath.attr("d").match(re)[1]
  let newPathH = getDatumLength(scaleLegend,breakpoints.length-1) + Number(currentPathH)
  let newPath = legendPath.attr("d").replace(currentPathH,newPathH)
  legendPath.attr("d",newPath)

  let tickPoints = [...breakpoints, (breakpoints[1]-breakpoints[0]+breakpoints[breakpoints.length-1])]
  .map(formatLegendTicks)
  let textClone = d3.select(id).select(".tick").select("text")
  let lineClone = d3.select(id).select(".tick").select("line")
  let legendTicks = d3.select(id).selectAll("g").data(tickPoints)

  legendTicks.enter()
  .append("g").attr("id","final-tick")
  .attr("class","tick").attr("transform",`translate(${newPathH.toFixed(1)},0)`)
  .append("text")
  .text(d=>d)
  .attr("y",textClone.attr("y"))
  .attr("dy",textClone.attr("dy"))

  d3.select("#final-tick").append("line")
  .attr("y2",lineClone.attr("y2"))
}
