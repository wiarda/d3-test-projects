import React from 'react'


export default function LoadingScreen(props){
  return (
    <div className="container-fluid">
      <div className="row p-5" />

      <div className="row">
        <div className="col-0 col-lg-2"/>

        <div className="col-12 col-lg-8">

          <div className="row">
            <div className="loader mx-auto"/>
          </div>

          <div className="row py-3"/>

          <div className="row">
            <div className="loading-text mx-auto">
              Loading
            </div>
          </div>

        </div>
      </div>

      <div className="col-0 col-lg-2"/>

    </div>
    )
  }
