import React from 'react'
import {render} from 'react-dom'
import {BrowserRouter as Router} from 'react-router-dom'
import css from './index.scss'
import App from 'Main/App'
const baseLocation = window.location.pathname

document.addEventListener("DOMContentLoaded", function(){
  render ((
    <Router
      basename={baseLocation}
    >
      <App/>
    </Router>
  )
    , document.getElementById("root"))
})
