import React from 'react'
import { useNavigate } from 'react-router-dom'
import img from '../img/404.png'
function NotFound() {
  const navigate = useNavigate()
  return (
    <div className="page-container not-found">
      <div className="not-found-text-container">
        <h1 className="not-found-h1">404</h1>
        <p className="oops-p">opps</p>
        <p className="oops-p">page not found</p>
      </div>

      <div className="not-found-img-container">
        <img className="not-found-img" src={img} alt="" />
      </div>
      <button onClick={() => navigate('/')} className="not-found-back-btn">
        back
      </button>
    </div>
  )
}

export default NotFound
