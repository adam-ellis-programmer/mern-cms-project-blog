import { useState, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import {
  toggleDeleteModal,
  deleteBlogPost,
  deleteAllImages,
} from '../../features/blog/blogSlice'
import { randNum } from '../../utils'

function DeleteBlogModal({ setLoading, setIsDeleting }) {
  useEffect(() => {
    const deleteDiv = deleteWrapRef
    console.log(deleteDiv.current)
    deleteDiv.current.focus()
    return () => {}
  }, [])
  const [isDisabled, setisDisabled] = useState(true)
  // can use:-> const [deleteCode] = useState(randNum()); // Initialize once
  const deleteCodeRef = useRef(randNum()) // Initialize once
  const deleteWrapRef = useRef(null)

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { blogID } = useParams()

  const { showDeleteModal } = useSelector((state) => state.blogs)
  const { user } = useSelector((state) => state.auth)

  const handleClose = () => {
    dispatch(toggleDeleteModal(!showDeleteModal))
  }

  const handleDeleteCode = (e) => {
    // deleteRef is randNum()
    if (e.target.value === deleteCodeRef.current) {
      setisDisabled(false)
    } else {
      setisDisabled(true)
    }
  }

  const handleDelete = async () => {
    setLoading(true)
    setIsDeleting(true)

    dispatch(deleteBlogPost(blogID))
    dispatch(toggleDeleteModal(!showDeleteModal))
    await dispatch(deleteAllImages({ blogID }))
    setLoading(false)
    setIsDeleting(false)
    navigate('/user-blogs')
  }

  return (
    <div tabIndex={-1} ref={deleteWrapRef} className="delete-modal">
      <div className="delete-modal-inner-div">
        <div className="delete-modal-body">
          <i className="fa-regular stop-sign fa-hand"></i>
          <p>Stop</p>
          <p>You are about to delete this blog article.</p>
          <p>Are you sure you wish to continue?</p>
        </div>

        <p className="delete-code-p">
          Please copy and paste <span>{deleteCodeRef.current}</span> to confirm delete.
        </p>

        <div className="delete-modal-input-container">
          <input
            className="delete-modal-input"
            type="text"
            placeholder="Enter delete code"
            onChange={handleDeleteCode}
          />
        </div>

        <div className="delete-modal-btn-container">
          <button
            onClick={handleDelete}
            className={`delete-modal-btn ${isDisabled && 'delete-btn-disabled'}`}
            disabled={isDisabled}
          >
            Delete
          </button>
          <button
            onClick={handleClose}
            className="delete-modal-btn close-delete-modal-btn"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteBlogModal
