import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useState } from 'react'
import { setBLog } from '../../features/blog/blogSlice'

const DeleteAllImagesModal = ({ setShowModal, deleteAllImages }) => {
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()
  const { blogID } = useParams() 
  const handleDeleRequest = async () => {
    setIsLoading(true)
    const res = await dispatch(deleteAllImages({ blogID })).unwrap()
    dispatch(setBLog(res.blog))
    setShowModal(false)
    setIsLoading(false)
  }
  return (
    <div className="delete-all-images-model-wrap">
      <div className="delete-all-images-modal-div">
        <div className="delete-inner delete-images-modal-header">
          <p>you are about to delete</p>
          <p>all images from this blog</p>
          <p>continue?</p>
        </div>
        <div className="delete-inner delete-images-modal-body">
          <button
            disabled={isLoading}
            onClick={handleDeleRequest}
            className={`img-control-btn ${isLoading && 'disable-btn'}`}
          >
            {isLoading ? 'deleting...' : 'delete'}
          </button>
          <button onClick={() => setShowModal(false)} className="img-control-btn">
            cancel
          </button>
        </div>
        <div className="delete-inner delete-images-modal-footer">
          <i className="fa-solid fa-circle-exclamation exclamation-icon"></i>
        </div>
      </div>
    </div>
  )
}

export default DeleteAllImagesModal
