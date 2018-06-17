'use strict'
import * as d3 from 'Helpers/d3'

export function defineScale({scale,dataset,dataprop,bufferFactor,rangeStart,rangeEnd}){
  return defineDomain({scale,dataset,dataprop,bufferFactor})
  .range([rangeStart,rangeEnd])
}

export function defineDomain({scale,dataset,dataprop,bufferFactor}){
  let min = d3.min(dataset,d=>d[dataprop])
  let max = d3.max(dataset,d=>d[dataprop])
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

  // if (d3.select("#"+id).empty()) {
  //   parent.append("g").attr("id",id).attr("class",className)
  //   .append("text").attr("id",`${id}-title`).attr("class",className)
  // }
  // return d3.select("#"+id)
}

export function selectElement(parent,id,className=null,initFn=null){
  if (d3.select("#"+id).empty()){
    let el = parent.append("g").attr("id",id).attr("class",className)
    if (initFn) initFn(el)
  }
  return d3.select("#"+id)
}
