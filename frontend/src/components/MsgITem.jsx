import { useState, useRef, forwardRef } from 'react'
import { setMessageID } from '../features/messages/msgSlice'
import { useDispatch, useSelector } from 'react-redux'
function MsgItem({
  msg: { fullName, about, email, msg, mailingList, date, time, phone, _id },
  i,
  deleteDiv,
  user,
}) {
  const dispatch = useDispatch()
  // leave in for testing
  // const { user } = useSelector((state) => state.auth)
  // const nav = useRef(null)
  // const [activeDeleteIndex, setActiveDeleteIndex] = useState(null) // State to track the active delete modal
  const [hoverIndex, setHoverIndex] = useState(null)
  const item = useRef(null)

  // Convert the msg string into an array of words
  const wordsArray = msg.split(' ')
  // Slice the array to get the first 5 words
  const truncatedMsg = wordsArray.slice(0, 5).join(' ') + '...'

  // detect resize and close modal
  const handleDeleteClick = (id) => {
    // item is msg-item
    // dispatch correct id to another component
    dispatch(setMessageID(id))
    const deleteContainer = deleteDiv.current
    // add the correct class to show
    deleteContainer.classList.add('show-delete-div')

    if (item.current) {
      const topPosition = item.current.offsetTop

      const left = item.current.getBoundingClientRect().left
      const right = item.current.getBoundingClientRect().right
      // console.log(left, right)

      // gets the corect coordinates using getBoundingClientRect()
      // get the center by dividing the two
      const center = left + right / 2
      // console.log(center)

      const deleteDivItem = deleteDiv.current

      const top = topPosition - 16

      deleteDivItem.style.top = `${top}px`
      deleteDivItem.style.left = `${center}px`

      // passed down into this component and TAB INDEX -1 used to get hook on element
      deleteDivItem.focus()
    } else {
      console.error('item.current is null')
    }
  }

  return (
    <>
      <article ref={item} className="msg-item">
        <div className="msg-div">
          {' '}
          <span className="msg-span">item number</span> <span>{i + 1}</span>
        </div>
        <div className="msg-div">
          {' '}
          <span className="msg-span">message date</span> <span>{date}</span>
        </div>
        <div className="msg-div">
          {' '}
          <span className="msg-span">message about</span> <span>{about}</span>
        </div>
        <div className="msg-div">
          {' '}
          <span className="msg-span">message from</span>
          <span>{fullName}</span>
        </div>
        <div className="msg-div">
          {' '}
          <span className="msg-span">email address</span>
          <span>{email}</span>
        </div>
        <div className="msg-div">
          {' '}
          <span className="msg-span">on mailing list</span>{' '}
          <span>{mailingList ? 'yes ' : 'no'}</span>
        </div>
        <div
          className="msg-div"
          onMouseEnter={() => setHoverIndex(i)}
          onMouseLeave={() => setHoverIndex(null)}
        >
          <span className="msg-span">message content</span>
          <span>
            {' '}
            <p>{truncatedMsg}</p>
          </span>
        </div>
        {hoverIndex === i && (
          <span className="content-div">
            <div className="content-inner-div">
              <div>from: {fullName}</div>
              <div>time: {time}</div>
              <div>phone: {phone}</div>
            </div>
            {msg}
          </span>
        )}
        {user && user.isSuperAdmin === true && (
          <div className="delete-msg-div">
            <button
              // CAN SEND ID AND INDEX IN AN OBJECT AND DESTRUCTURE
              onClick={() => handleDeleteClick(_id)} // Handle delete button click
              className="msg-delete-btn"
            >
              x
            </button>
          </div>
        )}
      </article>
    </>
  )
}

export default MsgItem
