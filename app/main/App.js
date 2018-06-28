import React from 'react'
import {Route, Switch} from 'react-router-dom'
import LandingPage from 'Main/LandingPage'
import {TDFLoader, GlobalTempLoader, EduLoader, TopMoviesLoader} from './loadables'
import LoadingScreen from 'Components/LoadingScreen'

export default function App(props){
  return (
    <Switch>
      <Route exact path="/" component={LandingPage}/>
      <Route exact path="/TourDeFrance" component={TDFLoader}/>
      <Route exact path="/GlobalTemperature" component={GlobalTempLoader}/>
      <Route exact path="/USEducation" component={EduLoader}/>
      <Route exact path="/TopMovies" component={TopMoviesLoader}/>
    </Switch>
  )
}
