import { useSelector } from 'react-redux'
import { useEffect, useRef } from 'react'

function MyAccDeleteAlert() {
  const alertDiv = useRef(null)
  const { msg } = useSelector((state) => state.user)
  useEffect(() => {
    const element = alertDiv.current
    element.focus()
    return () => {}
  }, [])
  return (
    <div tabIndex={-1} ref={alertDiv} className="my-acc-delete-alert">
      <h3>{msg}</h3>
    </div>
  )
}

export default MyAccDeleteAlert
