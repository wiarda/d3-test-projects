'use strict'
import * as d3 from 'Helpers/d3'

export function throttleResize(delay=100, type="resize", name="throttledResize", eventTarget = window){

  let resizeTimer
  eventTarget.addEventListener(type,dispatch)
  eventTarget.addEventListener("unsub",unsub,{once:true})

  function unsub(){
    eventTarget.removeEventListener(type,dispatch)
  }

  function dispatch(){
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(function(){
      requestAnimationFrame(function(){
        console.log("request animation frame")
        eventTarget.dispatchEvent(new CustomEvent(name))
      })
    },delay)
  }
}

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

export function selectGroup(parent,id,className=""){
  if (d3.select("#"+id).empty()) {
    parent.append("g").attr("id",id).attr("class",className)
    .append("text").attr("id",`${id}-title`).attr("class",className)
  }
  return d3.select("#"+id)
}

export function secondsToMinutes(seconds){
  let mins = Math.floor(seconds / 60)
  let secs = (seconds % 60)
  secs = String(secs).length === 1 ? '0' + String(secs) : secs
  return `${mins}:${secs}`
}

export function getOrdinal(n){
  return n + (["st","nd","rd"][((n+90)%100-10)%10-1]||"th")
}
