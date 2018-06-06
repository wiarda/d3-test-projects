import React from 'react'
import {render} from 'react-dom'
import {BrowserRouter as Router} from 'react-router-dom'
import css from './index.scss'
import App from 'Main/App'
import {throttleResize} from 'Helpers/helpers'
// const baseLocation = window.location.pathname

document.addEventListener("DOMContentLoaded", function(){
  throttleResize(200)
  render ((
    <Router
      basename="/"
    >
      <App/>
    </Router>
  )
    , document.getElementById("root"))
})
