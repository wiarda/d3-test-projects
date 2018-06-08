import React from 'react'
import Chart from 'Components/Chart'
import Background from 'Components/Background'
import Title from 'Components/Title'

export default class ChartWrapper extends React.Component{
  constructor(props){
    super(props)
    this.state = {height:null}
    this.deriveChartHeight = this.deriveChartHeight.bind(this)
    this.titleBoxPadding = this.props.titleBoxPadding || 40
    this.chartMarginY = this.props.chartMarginY || 50
  }

  componentDidMount(){
    this.deriveChartHeight()
    // this.props.drawChart.bind(this)()
    window.addEventListener("throttledResize",this.deriveChartHeight)
  }

  componentDidUpdate(){
    this.props.drawChart.bind(this)()
  }

  componentWillUnmount(){
    window.removeEventListener("throttledResize",this.deriveChartHeight)
    // window.dispatchEvent(new CustomEvent("unsub"))
  }

  deriveChartHeight(){
    let height = window.innerHeight - document.getElementById("title-box").clientHeight - this.chartMarginY
    this.setState({height:height})
  }

  render(){
    return(
    <React.Fragment>

      <Background
        img={this.props.img}
      />
      

      <Chart height={this.state.height}>
        <Title
          titleText={this.props.titleTextArr}
          titleBoxPadding={this.titleBoxPadding}
          deriveHeight={this.deriveChartHeight}
        />
      </Chart>

      <div id="tooltip"/>


    </React.Fragment>
    )
  }
}
