import React from 'react'
const RESPONSIVE_BREAKPOINT = 800

export default class Title extends React.Component{
  constructor(props){
    super(props)
    this.state = {width:null}
    this.height = window.innerHeight
    this.deriveLength = this.deriveLength.bind(this)
  }

  componentDidMount(){
    this.deriveLength()
  }

  getSnapshotBeforeUpdate(){
    return window.innerHeight
  }

  componentDidUpdate(prevProps,prevState,snapshot){
    //update the title box width after font-size changes due to responsive breakpoints
    if (this.height<=RESPONSIVE_BREAKPOINT && snapshot>RESPONSIVE_BREAKPOINT || this.height>RESPONSIVE_BREAKPOINT && snapshot<=RESPONSIVE_BREAKPOINT){
      this.height = window.innerHeight
      this.deriveLength()
    }
    else this.height = window.innerHeight
  }

  deriveLength(){
    let titles = document.getElementsByClassName("title")
    let length = Array.prototype.reduce.call(titles,function(acc,cur){
      return Math.max(acc,cur.clientWidth)
    },0)

    this.setState({width:length+this.props.titleBoxPadding})
  }


  render(){
    let length = this.props.titleText.length
    let titles = this.props.titleText.map((el,n)=>{
      return(
        <div className="row" key={n}>
          <h1 className="mx-auto title my-0">{el}</h1>
        </div>
      )
    })

    return (
      <div id="title-box"
        style={{maxWidth:this.state.width+"px"}}
      >
        <div className="row py-1"/>

        {titles}

        <div className="row py-1"/>
      </div>
    )
  }
}
