import { useDispatch, useSelector } from 'react-redux'
import {
  sendEmail,
  setShowEmailModal,
  getUserForEmailAdmin,
} from '../../features/admin/adminSlice'
import { toast } from 'react-toastify'
import { useEffect, useState } from 'react'
import { getCurrentUSer } from '../../features/users/userSlice'

const AdminEmailModal = () => {
  const dispatch = useDispatch()
  const { adminEmailUserID } = useSelector((state) => state.admin)
  const [user, setUser] = useState(null)
  const [adminUser, setAdminUser] = useState(null)
  const [fromName, setFromName] = useState('')
  const [toValue, setToValue] = useState('')
  const [bodyValue, setBodyValue] = useState('')
  const [subject, setSubject] = useState('')
  const [isSending, setIsSending] = useState(false) // New state variable

  useEffect(() => {
    const getData = async () => {
      try {
        const emailData = await dispatch(
          getUserForEmailAdmin({ id: adminEmailUserID })
        ).unwrap()
        setToValue(`${emailData?.email}` || '')

        const adminUser = await dispatch(getCurrentUSer()).unwrap()
        setUser(emailData)
        setAdminUser(adminUser)
        setFromName(`${adminUser?.name || ''}`)
      } catch (error) {
        console.log(error)
      }
    }

    getData()
  }, [adminEmailUserID, dispatch])

  const handleCloseModal = () => {
    dispatch(setShowEmailModal(false))
  }

  const formatEmailBody = (body) => {
    let formattedBody = body.replace(/\n/g, '<br>')
    formattedBody = formattedBody
      .split(/<br>/)
      .map((textSegment) => textSegment.trim())
      .map((textSegment) => (textSegment ? `<p>${textSegment}</p>` : '<br>'))
      .join('')
    return formattedBody
  }

  const handleSendEmail = async () => {
    if (isSendDisabled) return // Prevent sending if inputs are invalid or email is already sending

    setIsSending(true) // Start the sending process
    try {
      const formattedBody = formatEmailBody(bodyValue)

      const data = {
        from: fromName,
        to: toValue,
        text: formattedBody,
        subject,
      }

      await dispatch(sendEmail(data)).unwrap()

      dispatch(setShowEmailModal(false))
      toast.success('your email was sent!')
    } catch (error) {
      console.error('Error sending email:', error)
      toast.success('something went wrong')
    } finally {
      setIsSending(false)
    }
  }

  // Compute whether the send button should be disabled
  const isSendDisabled = !subject.trim() || !bodyValue.trim() || isSending

  return (
    <div className="admin-email-modal-wrap">
      <div className="admin-email-modal">
        <div className="admin-email-header">
          <h1>Send Email</h1>
          <i className="fa-regular fa-paper-plane send-icon"></i>
        </div>
        <div className="admin-email-body">
          <div className="admin-email-form-group">
            <input
              type="text"
              className="admin-email-input admin-email-to"
              placeholder="To"
              value={`TO: ${toValue}`}
              onChange={(e) => setToValue(e.target.value)}
              disabled
            />
          </div>
          <div className="admin-email-form-group">
            <input
              type="text"
              className="admin-email-input admin-email-from"
              placeholder="From"
              value={`FROM: ${fromName}`}
              onChange={(e) => setFromName(e.target.value)}
              disabled
            />
          </div>
          <div className="admin-email-form-group">
            <input
              type="text"
              className="admin-email-input admin-email-subject"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div className="admin-email-form-group">
            <textarea
              onChange={(e) => setBodyValue(e.target.value)}
              value={bodyValue}
              className="admin-email-input admin-email-text"
              placeholder="Email body"
            ></textarea>
          </div>
          <div className="admin-email-btn-wrap">
            <button
              onClick={handleSendEmail}
              className={`admin-email-btn ${isSendDisabled ? 'disabled' : ''}`}
              disabled={isSendDisabled}
            >
              {isSending ? 'Sending...' : 'Send'}
            </button>
            <button onClick={handleCloseModal} className="admin-email-btn">
              Cancel
            </button>
          </div>
        </div>
        <div className="admin-email-footer">
          <p>All emails are logged on our server</p>
        </div>
      </div>
    </div>
  )
}

export default AdminEmailModal
