import { useSelector, useDispatch } from 'react-redux'
import { useState, useRef, useEffect } from 'react'
import { toggleDeleteModal, deleteTask, setTasks } from '../../features/tasks/taskSlice'

function DeleteTaskModal() {
  const deleteRef = useRef()

  useEffect(() => {
    console.log(deleteRef.current)
    deleteRef.current.focus()
    return () => {}
  }, [deleteRef])

  const [isDisabled, setIsDisabled] = useState(false)
  const dispatch = useDispatch()
  const { showDeleteModal, taskID, tasks } = useSelector((state) => state.tasks)
  const updatedData = tasks.filter((item) => item._id !== taskID)

  const handleClose = () => {
    dispatch(toggleDeleteModal(!showDeleteModal))
  }

  const deleteCode = 'xxx'

  const handleDelete = () => {
    dispatch(deleteTask(taskID))
    dispatch(setTasks(updatedData))
    handleClose()
  }
  return (
    <div tabIndex={-1} ref={deleteRef} className="delete-modal">
      <div className="delete-modal-inner-div">
        <div className="delete-modal-body">
          <i className="fa-regular stop-sign fa-hand"></i>
          <p>stop</p>
          <p> you are about to delete this task</p>
          <p>are you sure you wish to continue?</p>
        </div>

        <p className="delete-code-p">
          please copy and paste <span>{deleteCode}</span> to cofirm delete
        </p>

        <div className="delete-modal-input-container">
          <input
            className="delete-modal-input"
            type="text"
            placeholder="enter delete code"
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
      </div>
    </div>
  )
}

export default DeleteTaskModal
