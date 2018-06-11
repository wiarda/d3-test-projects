'use strict'
import React from 'react'

// const WRAPPER_CLASS = "px-3 py-2"

export default function Sources({sources,links,className=null}){
  className = className ? `${className} pt-2`: "pt-2"
  sources = sources.map((source, index) =>{
    return (
        <div className="row m-0 px-5 pb-2" key={index}>
          <a href={links[index]}>{source}</a>
        </div>
    )
  })

  return (
    <div
      id="sources"
      className={className}
    >
      <div className="row m-0 px-5">
        Sources:
      </div>
      {sources}
    </div>
  )
}
