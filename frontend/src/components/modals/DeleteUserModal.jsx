import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  setUsers,
  deleteUserAdmin,
  setToggleDeleteUserModal,
} from '../../features/admin/adminSlice'

import { useRef, useEffect } from 'react'
function DeleteUserModal() {
  const deleteModal = useRef()
  useEffect(() => {
    const currentItem = deleteModal.current
    currentItem.focus()
    return () => {}
  }, [deleteModal])
  const [isDisabled, setisDisabled] = useState(true)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { users, deleteUserInfo, showDeleteUserModal } = useSelector(
    (state) => state.admin
  )
  const { id, userToDelete } = deleteUserInfo

  const handleClose = () => {
    dispatch(setToggleDeleteUserModal(!showDeleteUserModal))
  }

  const handleDelete = () => {
    const updatedUsers = users.filter((user) => user._id !== id)
    dispatch(setUsers(updatedUsers))
    dispatch(deleteUserAdmin(id))
    handleClose()
  }

  const handleDeleteCode = (e) => {
    if (e.target.value === userToDelete.name) {
      setisDisabled(false)
    } else {
      setisDisabled(true)
    }
  }

  const handleCopy = async (e) => {
    const { textContent } = e.target
    try {
      await navigator.clipboard.writeText(textContent.trim())
      console.log('Text copied to clipboard!')
    } catch (err) {
      console.error('Failed to copy text:', textContent)
    } finally {
    }
  }
  return (
    <div tabIndex={-1} ref={deleteModal} className="delete-modal">
      <div className="delete-modal-inner-div">
        <div className="delete-modal-body">
          <i className="fa-regular stop-sign fa-hand"></i>
          <p>stop</p>
          <p>
            you are about to delete{' '}
            <span className="user-to-delete-name">{userToDelete.name}</span>
          </p>
          <p>are you sure you wish to continue?</p>
        </div>

        <p className="user-delet-code-p">
          copy & paste <span onClick={handleCopy}>{userToDelete.name} </span> to confirm
          delete
        </p>
        <div className="delete-modal-input-container">
          <input
            className="delete-modal-input"
            type="text"
            placeholder="enter delete code"
            onChange={handleDeleteCode}
            // disabled={true}
          />
        </div>

        <div className="delete-modal-btn-container">
          <button
            onClick={handleDelete}
            className={`delete-modal-btn ${isDisabled && 'delte-btn-disabled '}`}
            disabled={isDisabled}
          >
            delete
          </button>
          <button
            onClick={handleClose}
            className=" delete-modal-btn close-delete-modal-btn"
          >
            close
          </button>
        </div>
        <div className="delete-code-div">
          <p>{/* <span>{deleteCode}</span> */}</p>
        </div>
      </div>
    </div>
  )
}

export default DeleteUserModal
