import { setDeleteCode, toggleUpdateModal } from '../features/blog/blogSlice'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { setBlogID, setBlogDeleteID, toggleDeleteModal } from '../features/blog/blogSlice'

import { randNum } from '../utils'

function AdminItem({
  // destructure props
  blog: {
    author,
    blogTitle,
    category,
    lastEdited,
    featured,
    suspended,
    createdAt,
    _id,
    publish,
    views,
  },
  index,
}) {
  const dispatch = useDispatch()
  const { showUpdateModalAdmin, showDeleteModal } = useSelector((state) => state.blogs)
  const handleUpdate = (id) => {
    dispatch(setBlogID(id))
    dispatch(toggleUpdateModal(!showUpdateModalAdmin))
  }

  const handleDelete = (id) => {
    // sets blog id for delete modal
    dispatch(setBlogID(id))

    // set and dispatch random pin
    const randomPin = randNum()
    console.log(randomPin)
    dispatch(setDeleteCode(randomPin))
    dispatch(toggleDeleteModal(!showDeleteModal))
  }

  return (
    <div className="admin-item">
      <div className="admin-item-inner-div">
        {
          <div className="icon-div">
            <div>
              {suspended && (
                <i className=" admin-icon  suspended-icon fa-solid fa-triangle-exclamation"></i>
              )}
            </div>
            <div>
              {publish && (
                <i className=" admin-icon  published-icon  fa-solid fa-feather-pointed"></i>
              )}
            </div>
            <div>
              {featured && (
                <i className=" admin-icon  featured-icon fa-solid fa-house"></i>
              )}
            </div>
          </div>
        }
        <span className="admin-blog-label">item</span>
        <p> {index + 1}</p>
      </div>
      <div className="admin-item-inner-div">
        <span className="admin-blog-label">written by</span>
        <p>{new Date(createdAt).toLocaleString('en-GB')}</p>
      </div>
      <div className="admin-item-inner-div">
        <span className="admin-blog-label">author</span>
        <p> {author}</p>
      </div>
      <div className="admin-item-inner-div">
        <span className="admin-blog-label">blog views</span>
        <p> {views}</p>
      </div>
      <div className="admin-item-inner-div">
        <span className="admin-blog-label">blog title</span>
        <p> {blogTitle}</p>
      </div>
      <div className="admin-item-inner-div">
        <span className="admin-blog-label">blog country</span>
        <p>{category}</p>
      </div>
      <div className="admin-item-inner-div">
        <span className="admin-blog-label">edited date</span>
        <p> {lastEdited}</p>
      </div>
      <div className="admin-item-inner-div">
        <span className="admin-blog-label">featured</span>
        <p> {featured ? 'yes' : 'no'}</p>
      </div>
      <div className="admin-btn-container">
        {/* needs to be Links */}
        <button
          onClick={() => handleUpdate(_id)}
          data-id="1"
          className="admin-btn admin-blog-btn"
        >
          manage
        </button>
        <button
          onClick={() => handleDelete(_id)}
          data-id="2"
          className="admin-btn admin-blog-btn"
          // MAKE CLASS A FUNCTION
        >
          delete
        </button>

        <Link to={`/public-blog/${_id}`} className="admin-btn admin-blog-btn">
          view
        </Link>
      </div>
    </div>
  )
}

export default AdminItem
