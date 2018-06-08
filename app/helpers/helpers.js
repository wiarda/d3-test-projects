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

export function defineScale(scaleFunc,dataset,dataprop,bufferFactor,margin,dimension){
  // let min = d3.min(dataset,d=>d[dataprop])
  // let max = d3.max(dataset,d=>d[dataprop])
  // let buffer = bufferFactor ? Math.round((max-min)/bufferFactor):0

  return defineDomain(scaleFunc, dataset, dataprop, bufferFactor).range([margin,dimension-margin])
}

export function defineDomain(scaleFunc,dataset,dataprop,bufferFactor){
  let min = d3.min(dataset,d=>d[dataprop])
  let max = d3.max(dataset,d=>d[dataprop])
  let buffer = bufferFactor ? Math.round((max-min)/bufferFactor):0
  return scaleFunc().domain([min-buffer,max+buffer])
}

export function getAxisLength(scale){
  return ( scale.range()[1] - scale.range()[0] ) / ( scale.domain()[1]-scale.domain()[0] )
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
