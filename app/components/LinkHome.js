import React from 'react'
import {Link} from 'react-router-dom'

export default function LinkHome(){
  return (
    <Link to="/" className="m-auto" title="Menu">
      <i className="fas fa-chevron-circle-left fa-2x link-home align-middle" />
    </Link>
  )
}
