import React from 'react'
import {Route, Switch} from 'react-router-dom'
import LandingPage from 'Main/LandingPage'
import {TDFLoader, GlobalTempLoader, EduLoader} from './loadables'
// import TourDeFrance from 'TDF/TourDeFrance'
// import GlobalTemperature from 'GlobalTemperature/GlobalTemperature'

export default function App(props){
  return (
    <Switch>
      <Route exact path="/" component={LandingPage}/>
      <Route exact path="/TourDeFrance" component={TDFLoader}/>
      <Route exact path="/GlobalTemperature" component={GlobalTempLoader}/>
      <Route exact path="/USEducation" component={EduLoader}/>
    </Switch>
  )
}
