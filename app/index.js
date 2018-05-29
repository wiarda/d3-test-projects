import React from 'react'
import {render} from 'react-dom'
import css from './index.scss'
import ScatterPlot from 'Scatter/App'

document.addEventListener("DOMContentLoaded", function(){
  render (<ScatterPlot/>, document.getElementById("root"))
})
