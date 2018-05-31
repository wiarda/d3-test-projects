import React from 'react'

const Background = props => {
  return (
    <img
      id="bg-image"
      src={props.img}
      className="background"
    />
  )
}

export default Background
