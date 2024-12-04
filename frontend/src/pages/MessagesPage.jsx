import { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllMsgsAdmin } from '../features/messages/msgSlice'
import MsgITem from '../components/MsgITem'
import GlobalPageLoader from '../components/loaders/GlobalPageLoader'
import { deleteMsgAdmin } from '../features/messages/msgSlice'
import NoDataPlaceHolder from '../components/place holder components/NoDataPlaceHolder'
import { scrollTop } from '../utils'

function MessagesPage() {
  const { messageID } = useSelector((state) => state.msg)
  const { user } = useSelector((state) => state.auth)
  console.log(messageID)
  const [messages, setMessages] = useState(null)
  const dispatch = useDispatch()
  useEffect(() => {
    scrollTop()
    const getData = async () => {
      const data = await dispatch(getAllMsgsAdmin()).unwrap()
      setMessages(data)
    }
    getData()
    return () => {}
  }, [])

  const deleteDiv = useRef()

  const handleDelete = () => {
    console.log(messageID)
    dispatch(deleteMsgAdmin(messageID))
    setMessages(messages.filter((item) => item._id !== messageID))
    handleClose()
  }

  const handleClose = () => {
    deleteDiv.current.classList.remove('show-delete-div')
  }

  if (!messages) {
    return <GlobalPageLoader />
  }
  return (
    <div className="page-container msg-container">
      <section className="msg-page-header">
        <h1>welcome to the message page</h1>
        <p>view and manage all messages here </p>
      </section>

      <section className="msg-display-section">
        <div className="msg-header">
          <div className="msg-div">item</div>
          <div className="msg-div">date</div>
          <div className="msg-div">about</div>
          <div className="msg-div">full name</div>
          <div className="msg-div">email</div>
          <div className="msg-div">mailing list</div>
          <div className="msg-div">message</div>
          {user && user.isSuperAdmin === true && (
            <div className="msg-div delete-msg-div">delete</div>
          )}
        </div>
        {messages && messages.length < 1 && (
          <NoDataPlaceHolder data={{ page: 'messages' }} />
        )}
        {messages &&
          messages.length > 0 &&
          messages.map((msg, i) => (
            <MsgITem key={i} msg={msg} i={i} deleteDiv={deleteDiv} user={user} />
          ))}
      </section>

      <div tabIndex={-1} ref={deleteDiv} className="delete-div">
        <p> Are you sure you want ?</p>
        <p>to delete this message</p>
        <div className="delte-msg-btn-container">
          <button onClick={handleDelete}>Yes</button>
          <button onClick={handleClose}>No</button>
        </div>
      </div>
    </div>
  )
}

export default MessagesPage
