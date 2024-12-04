import { useEffect, useRef, useState } from 'react'
import MessageForm from '../components/MessageForm'
import MobileBackBTN from '../components/MobileBackBTN'
import { useDispatch, useSelector } from 'react-redux'
import { setShowMsgAlert, setMsgAlertlMSG } from '../features/messages/msgSlice'
import arrow from '../img/arrow-2.png'
import { scrollTop } from '../utils'
function Ask() {
  const msgAlertDiv = useRef(null)
  const dispatch = useDispatch()
  const { showMsgAlert, msgAlertlMSG } = useSelector((state) => state.msg)

  useEffect(() => {
    scrollTop()

    return () => {}
  }, [])

  // *** SIDE EFFECT *** ///
  // reset show modal to false // global state
  useEffect(() => {
    setTimeout(() => {
      dispatch(setShowMsgAlert(false))
      dispatch(setMsgAlertlMSG(''))
    }, 6000)

    // return () => {}
  }, [showMsgAlert])

  useEffect(() => {
    // reset on exit
    return () => {
      dispatch(setShowMsgAlert(false))
      dispatch(setMsgAlertlMSG(''))
    }
  }, [])
  useEffect(() => {
    if (showMsgAlert === true) {
      const alert = msgAlertDiv.current
      console.log(alert)
      if (alert) {
        alert.focus()
      }
    }
    return () => {}
  }, [showMsgAlert])

  return (
    <div className="page-container ask-container">
      <div className="ask-me-grid-wrap">
        <div>
          <section className="ask-header">
            <h1>
              <span>get in touch and ask us a question!</span>
            </h1>
            <p className="ask-p">
              send us a message using the form and one of our team will get back to you
            </p>
            <div className="speach-icon-wrap">
              <i className="speach-icon fa-regular fa-envelope"></i>
            </div>
            <p className="ask-us-p">Ask us anything</p>
            <img className="message-arrow-icon" src={arrow} alt="" />
            {/* <i className="message-arrow-icon fa-solid fa-arrow-right"></i> */}
          </section>
        </div>
        <div>
          <div className="message-form-wrap">
            <section className="message-form-header">
              <p>
                use our messaging form to send us a message and we shall get back to you
                as soon as we can!
              </p>
              <MobileBackBTN />
            </section>
            {showMsgAlert && (
              <div ref={msgAlertDiv} className="msg-page-toast" tabIndex="0">
                {msgAlertlMSG}
              </div>
            )}
            <MessageForm />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Ask
