import { useSelector, useDispatch } from 'react-redux'
import { useState } from 'react'
import { setShowEmailModal } from '../features/admin/adminSlice'
function EmailItem({ data: { _id, name, email, date, time }, index }) {
  const dispatch = useDispatch()
  const { showEmailModal } = useSelector((state) => state.admin)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleCopy = async ({ e, email }) => {
    // leave in for testing:
    // console.log(e.currentTarget.getBoundingClientRect())
    try {
      await navigator.clipboard.writeText(email)
      console.log('Text copied to clipboard!')
      setShowSuccess(true) // Set state to show success message
    } catch (err) {
      console.error('Failed to copy text:', email)
    } finally {
      // Consider resetting showSuccess after a timeout for temporary display
      setTimeout(() => setShowSuccess(false), 2000) // Hide after 2 seconds
    }
  }

  function truncate(text, maxLength) {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...'
    } else {
      return text
    }
  }
  // {truncate(email, 20)}
  // style={{ top:clientY + 'px', left: clientX + 'px'}}). <-- for getBoundingClientRect()

  const handleToggle = (id) => {
    console.log(id)
    dispatch(setShowEmailModal({ boolean: !showEmailModal, id }))
  }
  return (
    <div className="email-item">
      <div className="email-item-inner-div">
        <span className="email-item-label">item</span>
        <p>{index + 1}</p>
      </div>
      <div className="email-item-inner-div">
        <span className="email-item-label">name</span>
        <p>{name}</p>
      </div>
      <div className="email-item-inner-div">
        <span className="email-item-label">email</span>
        <p className="email-p" onClick={(e) => handleCopy({ e, email })}>
          {email}
          {/* to test remove the conditinal render and see them all lined up */}
          {/* virtual dom , state changes, diffing, Reconciliation */}
          {showSuccess && <span className="success-div"> copied!</span>}
        </p>
      </div>
      <div className="email-item-inner-div">
        <span className="email-item-label">date</span>
        <p>{date}</p>
      </div>
      <div className="email-item-inner-div">
        <span className="email-item-label">time</span>
        <p>{time}</p>
      </div>
      <div className="email-item-inner-div">
        <span className="email-item-label">email</span>
        <p>
          <button onClick={() => handleToggle(_id)} className="admin-send-email-btn">
            <i className="fa-solid fa-paper-plane send-email-icon"></i>
          </button>
        </p>
      </div>
    </div>
  )
}

export default EmailItem
