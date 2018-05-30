import React from 'react'
import D3 from 'd3'
import Chart from 'Components/Chart'
import Background from 'Components/Background'
import Title from 'Components/Title'
import img from 'TDF/assets/tour-de-france-d3-scatter-plot-bg.jpg'

let data = fetch("https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json")
.then(r=>r.json())


export default class App extends React.Component{
  constructor(props){
    super(props)
  }

  render(){
    return(
    <React.Fragment>

      <Background
        img={img}
      />

      <Chart>
        <Title
          titleText={["Doping at","Le Tour de France"]}
          titleBoxPadding={40}
        />
      </Chart>

    </React.Fragment>
    )
  }
}
