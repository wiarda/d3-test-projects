import React from 'react'

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

              <div className="row p-1"/>

              <div className="row">
                <div id="chart-box">
                  <svg
                    id="chart-svg"
                    width="100%"
                    // height={this.props.height}
                  />
                </div>
              </div>

            </div>

            <div className="col-0 col-sm-1"/>
          </div>
        </div>
    )
  }
}
