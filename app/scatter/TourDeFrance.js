import React from 'react'
import D3 from 'd3'
import Chart from 'Components/Chart'
import img from 'Scatter/assets/tour-de-france-d3-scatter-plot-bg.jpg'

let data = fetch("https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json")
.then(r=>r.json())


export default class App extends React.Component{
  constructor(props){
    super(props)
  }

  render(){
    return(
    <Chart
      img={img}
      titleText={["Doping at","Le Tour de France"]}
      titleBoxPadding={40}
    />
    )
  }

}
