import React from 'react'
import Title from 'Components/Title'


export default class Chart extends React.Component{
  constructor(props){
    super(props)
    this.state = {bg:null}
  }

  render(){
    return (
        <div className="container-fluid">
          <div className="row">
            <div className="col-0 col-sm-1"/>

            <div className="col-12 col-sm-10">

              {this.props.children}

              <div className="row">
                <svg id="scatter-plot"/>
              </div>

            </div>

            <div className="col-0 col-sm-1"/>
          </div>
        </div>
    )
  }
}
