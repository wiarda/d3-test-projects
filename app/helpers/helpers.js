'use strict'

export function throttleResize(delay=100, type="resize", name="throttledResize", eventTarget = window){

  let resizeTimer
  eventTarget.addEventListener(type,dispatch)
  eventTarget.addEventListener("unsub",unsub,{once:true})

  function unsub(){
    "unsub event handler"
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

export function unthrottle(){

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
