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

                <Link to="/TourDeFrance">Doping at Le Tour de France</Link>

              </div>
            </div>

          </div>
          <div className="col-2"/>
        </div>

      </div>
    </React.Fragment>
  )
}
