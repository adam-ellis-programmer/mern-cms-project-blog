import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { setShowEmailModal } from '../features/admin/adminSlice'
function EmailSentItem({ data: { _id, to, from, subject, read }, index }) {
  const dispatch = useDispatch()
  const { showEmailModal } = useSelector((state) => state.admin)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleCopy = async ({ e, email }) => {
    console.log(e)
    console.log(e.currentTarget.getBoundingClientRect())
    try {
      await navigator.clipboard.writeText(email)
      console.log('Text copied to clipboard!')
      setShowSuccess(true) // Set state to show success message
    } catch (err) {
      console.error('Failed to copy text:', email)
    } finally {
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
  // leave for reference
  // {truncate(email, 20)}
  // style={{ top:clientY + 'px', left: clientX + 'px'}}). <-- for getBoundingClientRect()

  const handleToggle = (id) => {
    console.log(id)
    dispatch(setShowEmailModal({ boolean: !showEmailModal, id }))
  }
  return (
    <Link className="email-item-link" to={`/view-sent-email-data-page/${_id}`}>
      <div className="email-item">
        <div className="email-item-inner-div">
          <span className="email-item-label">item</span>
          <p>{index + 1}</p>
        </div>
        <div className="email-item-inner-div">
          <span className="email-item-label">to</span>
          <p>{to}</p>
        </div>
        <div className="email-item-inner-div">
          <span className="email-item-label">from</span>
          <p className="email-p">
            {from}
            {/* to test remove the conditinal (showSuccess) render and see them all lined up */}
            {/* virtual dom , state changes, diffing, Reconciliation */}
            {showSuccess && <span className="success-div"> copied!</span>}
          </p>
        </div>
        <div className="email-item-inner-div">
          <span className="email-item-label">date</span>
          <p>{truncate(subject, 20)}</p>
        </div>
        <div className="email-item-inner-div">
          <span className="email-item-label">read</span>
          <p>{read ? 'read' : 'not read'}</p>
        </div>
      </div>
    </Link>
  )
}

export default EmailSentItem
