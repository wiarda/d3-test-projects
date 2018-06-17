import React from 'react'
import Chart from 'Components/Chart'
import Background from 'Components/Background'
import Title from 'Components/Title'
import Sources from 'Components/Sources'

export default class ChartWrapper extends React.Component{
  constructor(props){
    super(props)
    this.state = {height:null}
    this.deriveChartHeight = this.deriveChartHeight.bind(this)
    this.titleBoxPadding = this.props.titleBoxPadding || 40
    this.chartFooterMargin = this.props.chartFooterMargin || 50
  }

  componentDidMount(){
    this.deriveChartHeight()
    // this.props.drawChart.bind(this)()
    window.addEventListener("throttledResize",this.deriveChartHeight)
  }

  componentDidUpdate(){
    this.props.drawChart(this.props.data,this.props.helpers,this.props.d3)
  }

  componentWillUnmount(){
    window.removeEventListener("throttledResize",this.deriveChartHeight)
    // window.dispatchEvent(new CustomEvent("unsub"))
  }

  deriveChartHeight(){
    let height = window.innerHeight - document.getElementById("title-box").clientHeight - document.getElementById("sources").clientHeight - this.chartFooterMargin
    this.setState({height:height})
  }

  render(){
    return(
    <React.Fragment>

      <Background
        img={this.props.img || null}
      />


      <Chart
        height={this.state.height}
        className={this.props.chartClassName}
      >
        <Title
          key="title"
          titleText={this.props.titleTextArr}
          titleBoxPadding={this.titleBoxPadding}
          deriveHeight={this.deriveChartHeight}
          className={this.props.chartClassName}
        />
        <Sources
          key="sources"
          sources={this.props.sourcesArray}
          links={this.props.linksArray}
          className={this.props.chartClassName}
        />
      </Chart>

      <div id="tooltip" className={this.props.chartClassName}/>


    </React.Fragment>
    )
  }
}
