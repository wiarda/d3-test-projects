'use strict'

export function throttleResize(delay=100,type="resize", name="optimizedResize", eventTarget = window){
  let isActive = false

  function dispatch(){
    if (isActive) return
    isActive = true
    setTimeout(function(){
      requestAnimationFrame(function(){
      console.log("request animation frame")
      eventTarget.dispatchEvent(new CustomEvent(name))
      isActive = false
      })
    },delay)
}
  eventTarget.addEventListener(type,dispatch)
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
