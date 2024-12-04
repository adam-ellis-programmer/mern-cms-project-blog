import { useEffect, useState } from 'react'
import { toggleUpdateModal } from '../../features/blog/blogSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { getUserBlog, updateUserBlog } from '../../features/blog/blogSlice'
function UpdateBlogModal() {
  const dispatch = useDispatch()
  const { showUpdateModal, blog } = useSelector((state) => state.blogs)

  const { blogID } = useParams()

  const [formData, setFormData] = useState({
    blogTitle: '',
    author: '',
    blogBody: '',
    country: '',
    publish: false,
    featured: false,
  })
  const { blogTitle, author, blogBody, featured, publish, country } = formData

  useEffect(() => {
    dispatch(getUserBlog(blogID))
  }, [blogID])

  useEffect(() => {
    setFormData((prevState) => ({
      ...prevState,
      blogTitle: blog.blogTitle || '',
      author: blog.author || '',
      blogBody: blog.blogBody || '',
      country: blog.country || '',
      publish: blog.publish || false,
      featured: blog.featured || false,
    }))
  }, [blog])

  const onMutate = (e) => {
    const { id, checked, type, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [id]: type === 'checkbox' ? checked : e.target.value,
    }))
  }

  const handleClose = () => {
    dispatch(toggleUpdateModal(!showUpdateModal))
  }

  const onSubmit = (e) => {
    e.preventDefault()
    dispatch(
      updateUserBlog({
        id: blogID,
        data: {
          ...formData,
          status: 'edited',
          publish,
          featured,
          lastEdited: new Date().toLocaleString('en-GB'),
        },
      })
    )
    dispatch(toggleUpdateModal(false))
  }

  return (
    <div className="modal-container">
      <div className="modal">
        <button onClick={handleClose} className="close-modal-btn">
          cancel
        </button>
        <div className="modal-body">
          <form onSubmit={onSubmit}>
            <div className="admin-controls-div">
              <label className=" admin-check-label">
                <input
                  className="admin-check"
                  onChange={onMutate}
                  type="checkbox"
                  name="featured"
                  id="featured"
                  value={false}
                  checked={featured}
                />
                featured
              </label>
              <label className=" admin-check-label">
                <input
                  className="admin-check"
                  onChange={onMutate}
                  type="checkbox"
                  name="publish"
                  id="publish"
                  value={false}
                  checked={publish}
                />
                publish
              </label>
            </div>
            <div className="modal-form-control">
              <label className="update-label" htmlFor="blogTitle">
                Blog Title
              </label>
              <input
                id="blogTitle"
                name="blogTitle"
                type="text"
                className="modal-input"
                placeholder="blog title"
                value={blogTitle}
                onChange={onMutate}
              />
            </div>
            <div className="modal-form-control">
              <label className="update-label" htmlFor="blogTitle">
                Country
              </label>
              <input
                id="country"
                name="country"
                type="text"
                className="modal-input"
                placeholder="blog title"
                value={country}
                onChange={onMutate}
              />
            </div>
            <div className="modal-form-control">
              <label className="update-label" htmlFor="author">
                Blog Author
              </label>
              <input
                id="author"
                name="author"
                type="text"
                className="modal-input"
                placeholder="blog author"
                value={author}
                onChange={onMutate}
              />
            </div>
            <div className="modal-form-control">
              <label className="update-label" htmlFor="blogBody">
                Blog Body
              </label>
              <textarea
                id="blogBody"
                name="blogBody"
                className="modal-text-area"
                value={blogBody}
                onChange={onMutate}
              ></textarea>
            </div>

            <div className="modal-form-control update-modal-btn-container">
              <button className="update-modal-btn">update</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default UpdateBlogModal
