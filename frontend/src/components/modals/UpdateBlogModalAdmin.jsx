import { useEffect, useState } from 'react'
import { toggleUpdateModal, setAdminBlogs } from '../../features/blog/blogSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import {
  getBlogAdmin,
  updateBlogAdmin,
  resetAdminBlog,
} from '../../features/blog/blogSlice'
function UpdateBlogModalAdmin() {
  const dispatch = useDispatch()
  const { showUpdateModal, blogID, adminBlog, adminBlogs } = useSelector(
    (state) => state.blogs
  )

  const [formData, setFormData] = useState({
    blogTitle: '',
    author: '',
    blogBody: '',
    country: '',
    publish: false,
    suspended: false,
    featured: false,
  })
  const { blogTitle, author, blogBody, publish, suspended, featured, country } = formData

  useEffect(() => {
    dispatch(getBlogAdmin(blogID))
  }, [blogID])

  useEffect(() => {
    // need || to stop controllded input error
    setFormData((prevState) => ({
      ...prevState,
      blogTitle: adminBlog.blogTitle || '',
      author: adminBlog.author || '',
      blogBody: adminBlog.blogBody || '',
      country: adminBlog.country || '',
      publish: adminBlog.publish || false,
      featured: adminBlog.featured || false,
      suspended: adminBlog.suspended || false,
    }))
  }, [adminBlog])

  const onMutate = (e) => {
    const { name, type, checked, id, placeholder } = e.target

    setFormData((prevState) => ({
      ...prevState,
      [id]: type === 'checkbox' ? checked : e.target.value,
    }))
  }

  const handleClose = () => {
    dispatch(toggleUpdateModal(!showUpdateModal))
    dispatch(resetAdminBlog())
  }

  const onSubmit = (e) => {
    e.preventDefault()
    dispatch(
      updateBlogAdmin({
        id: blogID,
        data: {
          ...formData,
          status: 'edited',
          publish,
          featured,
          suspended,
          lastEdited: new Date().toLocaleString('en-GB'),
        },
      })
    )

    // updates the DOM immediately
    const itemToEdit = adminBlogs.find((item) => item._id === blogID)
    console.log(itemToEdit)
    const updatedData = {
      ...itemToEdit,
      status: 'edited',
      blogTitle,
      author,
      blogBody,
      country,
      publish,
      suspended,
      featured,
      lastEdited: new Date().toLocaleString('en-GB'),
    }

    // update the UI
    const data = adminBlogs.map((item) => (item._id === blogID ? updatedData : item))

    dispatch(toggleUpdateModal(false))
    dispatch(resetAdminBlog())
    dispatch(setAdminBlogs(data))
  }

  return (
    <div className="modal-container">
      <div className="modal">
        <h3 className="admin-h3">
          <span>admin controls</span>
        </h3>

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
                  value={featured}
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
                  value={publish}
                  checked={publish}
                />
                publish
              </label>
              <label className=" admin-check-label">
                <input
                  className="admin-check"
                  onChange={onMutate}
                  type="checkbox"
                  name="suspended"
                  id="suspended"
                  value={suspended}
                  checked={suspended}
                />
                suspended
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
              <label className="update-label" htmlFor="author">
                Country
              </label>
              <input
                id="country"
                name="country"
                type="text"
                className="modal-input"
                placeholder="blog country"
                value={country}
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
                className="modal-text-area admin-text-area"
                value={blogBody}
                onChange={onMutate}
              ></textarea>
            </div>

            <div className="modal-form-control update-modal-btn-container">
              <button className="update-modal-btn">update as adnin</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default UpdateBlogModalAdmin
