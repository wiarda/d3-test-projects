'use strict'
import Loadable from 'react-loadable'
import imports from 'Helpers/importModules'
import ChartWrapper from 'Components/ChartWrapper'
// import * as d3select from 'd3-selection'

const defaultLoading = {
  loading: Loading
  ,delay: 200
  ,timeout: 10000
}

function Loading(props){
  console.log(props)
  if (props.error) return (
       <div>Error! <button onClick={ props.retry }>Retry</button></div>
     )
  else if (props.timedOut) return (
       <div>
         Timed out, please try reloading
         <button onClick={props.retry}> Reload</button>
       </div>
     )
  else if (props.pastDelay) return (
       <div>Loading...</div>
     )
  else return null
}

export const TDFLoader = Loadable({
  loader(){
    return import('TDF/TourDeFrance')
  }
  ,...defaultLoading
})

export const GlobalTempLoader = Loadable({
  loader: () => {
      return new Promise(async $export=>{
      const [image,rawData,draw,helpers,d3] = await imports(
        import('GlobalTemperature/assets/desert.jpg')
        ,import('GlobalTemperature/assets/monthly_avg_land_temp.txt')
        ,import('GlobalTemperature/drawGlobalTempChart')
        ,import('Helpers/d3Helpers')
        ,import('Helpers/d3')
        // ,import('GlobalTemperature/global-temp.scss')
      )

      $export({image,rawData,draw,helpers,d3})
    })
  }
  ,render(module,props){
    return (
      <ChartWrapper
        data={Promise.resolve(JSON.parse(module.rawData))}
        d3={module.d3}
        helpers={module.helpers}
        drawChart={module.draw}
        img={module.image}
        titleTextArr={["Average Global Temperature","1753 to 2017"]}
        chartFooterMargin={50}
        chartClassName="globaltemp"
        sourcesArray={["Berkeley Earth Time Series Data: All Land Monthly Average Temperature"]}
        linksArray={["http://berkeleyearth.org/data/"]}
      />
    )
  }
  ,...defaultLoading
})
