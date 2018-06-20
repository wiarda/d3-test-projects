import React from 'react'

const Background = props => {
  let className = props.className ? `${props.className} background` : "background"
  return (
    <img
      id="bg-image"
      src={props.img}
      className={className}
    />
  )
}

export default Background
