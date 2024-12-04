import React from 'react'
import load from './load-1.gif'
function Loading() {
  return (
    <div className="loading-container">
      <div className="loading-div">
        <p className="loading-p">we are creating your blog</p>
        <p className="loading-p">this may take a few seconds</p>
        <img src={load} alt="" />
      </div>
    </div>
  )
}

export default Loading
