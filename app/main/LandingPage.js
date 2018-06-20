import React from 'react'
import {Link} from 'react-router-dom'
import Background from 'Components/Background'

export default function LandingPage(props){
  return(
    <React.Fragment>
      <Background
        src={null}
      />
      <div className="container-fluid">
        <div className="row p-3"/>

        <div className="row p-3">
          <div className="col-2"/>
          <div className="col-8">

            <div className="container-fluid">

              <div className="row">
                <Link to="/TourDeFrance" className="chart-link">
                  Doping at Le Tour de France
                </Link>
              </div>

              <div className="row">
                <Link to="/GlobalTemperature" className="chart-link">
                  Global Temperature from 1753 to 2015
                </Link>
              </div>

              <div className="row">
                <Link to="/USEducation" className="chart-link">
                  Educational Attainment Levels in the United States
                </Link>
              </div>

              <div className="row">
                <Link to="/TopMovies" className="chart-link">
                  Top Movies by Domestic Grosses
                </Link>
              </div>

            </div>

          </div>
          <div className="col-2"/>
        </div>

      </div>
    </React.Fragment>
  )
}
