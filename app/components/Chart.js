import React from 'react'
import Background from 'Components/Background'
import Title from 'Components/Title'


export default class Chart extends React.Component{
  constructor(props){
    super(props)
    this.state = {bg:null}
  }

  render(){
    return (
      <React.Fragment>
        <Background
          img={this.props.img}
        />
        <div className="container-fluid">
          <div className="row">
            <div className="col-0 col-sm-1"/>

            <div className="col-12 col-sm-10">

              <Title
                titleText={this.props.titleText}
              />

              <div className="row">
                <svg id="scatter-plot"/>
              </div>

            </div>

            <div className="col-0 col-sm-1"/>
          </div>
        </div>

      </React.Fragment>
    )
  }
}
