import React from 'react'
import {Route, Switch} from 'react-router-dom'
import TourDeFrance from 'TDF/TourDeFrance'
import LandingPage from './LandingPage'

export default function App(props){
  return (
    <Switch>
      <Route exact path="/" component={LandingPage}/>
      <Route exact path="/TourDeFrance" component={TourDeFrance}/>
    </Switch>
  )
}
