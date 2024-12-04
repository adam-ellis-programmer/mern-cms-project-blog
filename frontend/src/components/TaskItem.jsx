import { useDispatch, useSelector } from 'react-redux'

import {
  toggleDeleteModal,
  setTaskID,
  setTaskItem,
  setIsEditMode,
  updateTask,
  setTasks,
} from '../features/tasks/taskSlice'

// leave in for reference
function truncate(text, maxLength) {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + '...'
  } else {
    return text
  }
}

function TaskItem({ task, i }) {
  // const [editedTaskID, setEditedTaskID] = useState(null)
  const dispatch = useDispatch()
  const { showDeleteModal, tasks } = useSelector((state) => state.tasks)
  const { date, time, taskText, completed, _id, important } = task

  // can use data-id ad ref
  const handleDeleteModal = ({ id, i }) => {
    dispatch(toggleDeleteModal(!showDeleteModal))
    // setID for delete modal
    dispatch(setTaskID(id))
  }

  // handle task update and class add / removal
  const handleUpdateMode = (id) => {
    // Remove edit-active class from previously selected task
    const previousActiveTask = document.querySelector('.task-list-item.edit-active')
    if (previousActiveTask) {
      previousActiveTask.classList.remove('edit-active')
    }

    // Add edit-active class to the clicked task
    const clickedTask = document.querySelector(`.task-list-item[data-id="${id}"]`)
    // add edit mode class
    if (clickedTask) {
      clickedTask.classList.add('edit-active')
    }

    const task = tasks.find((item) => item._id === id)

    dispatch(setIsEditMode(true))
    dispatch(setTaskItem(task))

    const taskInput = document.querySelector('.task-input')

    // if true add bring into focus
    if (taskInput) {
      taskInput.focus()
    }
  }
  // handle the completed functionality
  const handleToggleDone = (id) => {
    // Find the index of the item with the given id -> find by index
    const index = tasks.findIndex((item) => item._id === id)

    // If item is not found, return
    if (index === -1) return

    // Get a reference to the item to update
    const item = tasks[index]

    // Create a copy of the item with the completed property toggled
    const updatedItem = {
      ...item,
      completed: !item.completed,
    }

    // Create a copy of the tasks array with the updated item
    const updatedTasks = [...tasks]

    // set (update) that item
    updatedTasks[index] = updatedItem

    // Update the (DOM) state with the new array of tasks
    dispatch(setTasks(updatedTasks))

    // get correct item to update
    const itemToUpdate = updatedTasks[index]
    // update the data base
    dispatch(updateTask({ id, data: itemToUpdate }))

    // Return the updated item (if needed for further processing)
    return updatedItem
  }

  return (
    <li className={`task-list-item }`} data-id={_id}>
      <div className="task-date-div ">
        <div className="task-info">
          {important && (
            <i className="important-marker fa-solid fa-circle-exclamation"></i>
          )}
        </div>

        <p className="task-date task-info">
          {' '}
          <span className="mobile-label">date</span> {date}
        </p>

        <p className="task-time task-info">{time}</p>
      </div>

      <div className=" task-info task-tex-p">
        <span className="mobile-label">task text</span>
        <p className={` ${completed && 'strike-through'}`}>{taskText}</p>
      </div>

      <div className="task-info">
        <span className="mobile-label ">status</span>
        <p className="completed-p">{completed ? 'completed' : 'to do'}</p>
      </div>

      <div className="task-btn-container">
        <button
          onClick={() => handleToggleDone(_id)}
          className={`done-task-btn task-btn ${completed && 'completed-toggle'}`}
        >
          done
        </button>
        <button
          onClick={() => handleUpdateMode(_id)}
          className="update-task-btn task-btn"
        >
          update
        </button>
        <button
          onClick={() => handleDeleteModal({ id: _id, i })}
          className="delete-task-btn task-btn"
        >
          delete
        </button>
      </div>
    </li>
  )
}

export default TaskItem
