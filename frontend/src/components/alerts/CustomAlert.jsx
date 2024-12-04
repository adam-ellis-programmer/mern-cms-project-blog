import React from 'react'

function CustomAlert({ msg, clr }) {
  const styles = {
    background: clr,
  }
  return (
    <div className="custom-alert-div" style={styles}>
      <p>{msg}</p>
    </div>
  )
}

export default CustomAlert
