import React from 'react'
import {render} from 'react-dom'
import css from './index.scss'
import App from 'Scatter'

document.addEventListener("DOMContentLoaded", function(){
  render (<App/>, document.getElementById("root"))
})
