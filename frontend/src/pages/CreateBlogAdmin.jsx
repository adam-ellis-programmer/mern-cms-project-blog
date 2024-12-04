import React, { useState, useEffect, useRef } from 'react'

import { getAllUsersAdmin } from '../features/admin/adminSlice'
import { useDispatch, useSelector } from 'react-redux'
import { createBlogAsAdmin, updateBlogAdmin } from '../features/blog/blogSlice'
import Loading from '../components/loaders/Loading'
import NotAuthorized from '../components/NotAuthorized'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { scrollTop } from '../utils'

function CreateBlogAdmin() {
  const navigate = useNavigate()

  // this locks the screen if user is not admin or suspended
  // or some other kind of err
  const { isRejected, errMSG } = useSelector((state) => state.admin)
  const [submited, setSubmited] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [loading, setLoading] = useState(false)
  const [userSelectData, setUserSelectData] = useState({
    userDropDownID: '',
    userDropDownName: '',
  })

  // get current user
  const { user } = useSelector((state) => state.auth)

  const [formData, setFormData] = useState({
    author: '',
    blogTitle: '',
    country: '',
    blogBody: '',
    featured: false,
    publish: false,
    status: '',
    createdByAdmin: true,
  })

  const { blogTitle, country, blogBody, featured, publish, createdByAdmin, author } =
    formData
  // const { isError, errMSG } = useSelector((state) => state.user)

  const { userDropDownID, userDropDownName } = userSelectData
  const userDropDown = useRef(null)

  const imagesInputRef = useRef(null)
  const heroImageInputRef = useRef(null)

  const [images, setImages] = useState([])
  const [heroImage, setHeroImage] = useState(null)

  const dispatch = useDispatch()
  const { users } = useSelector((state) => state.admin)

  // on page load
  useEffect(() => {
    scrollTop()
    dispatch(getAllUsersAdmin())
    return () => {}
  }, [])

  //prettier-ignore
  const handleUserSelect = (e) => {
    const userElement = userDropDown.current
    const selectedOption = userElement.selectedOptions[0]
    // if (selectedOption.dataset.id === 'please-select') return
    setUserSelectData((prevState) => ({
      ...prevState,
      userDropDownID: selectedOption.id,
      // if please select is selected the set to ''
      userDropDownName: selectedOption.dataset.id === 'please-select' ? '' : selectedOption.value,
    }))
  }

  const onChange = (e) => {
    const { type, id, checked } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [id]: type === 'checkbox' ? checked : e.target.value,
    }))
  }

  // opens the select box
  const triggerImagesSelect = () => {
    if (imagesInputRef.current) {
      imagesInputRef.current.click()
    }
  }

  // opens the select box
  const triggerHeroImageSelect = () => {
    if (heroImageInputRef.current) {
      heroImageInputRef.current.click()
    }
  }

  // sets state with selected files
  const handleImagesChange = (e) => {
    const selectedFiles = Array.from(e.target.files)
    setImages(selectedFiles)
  }

  // sets state with selected files
  const handleHeroImageChange = (e) => {
    const selectedFile = e.target.files[0]
    setHeroImage(selectedFile)
  }

  // use form data as we are working with files
  const onSubmit = async (e) => {
    setLoading(true)
    e.preventDefault()

    // set formData obj
    const formData = new FormData()

    // Append text data
    formData.append('author', userDropDownName)
    formData.append('blogTitle', blogTitle)
    formData.append('country', country)
    formData.append('blogBody', blogBody)
    formData.append('featured', featured)
    formData.append('publish', publish)
    formData.append('userID', userDropDownID)

    // Append hero image
    if (heroImage) {
      formData.append('heroImage', heroImage)
    }

    // Append other images with loop
    if (images.length > 0) {
      images.forEach((image) => {
        formData.append('images', image) // 'images' field name will collect all image files
      })
    }

    try {
      const res = await dispatch(createBlogAsAdmin(formData)).unwrap()

      toast.success('Success! Blog created')
      handleClearForm()
      navigate(`/user-blog/${res._id}`)
    } catch (error) {
      toast.error('Failed to create blog')
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  const handleClearForm = () => {
    setFormData({
      author: '',
      blogTitle: '',
      country: '',
      blogBody: '',
      featured: false,
      publish: false,
    })

    // if (submited === true) return

    if (userDropDown.current) {
      const userElement = userDropDown.current
      userElement.value = 'please select author'
      const selectedOption = userElement.selectedOptions[0]
      setUserSelectData((prevState) => ({
        ...prevState,
        userDropDownID: selectedOption.id,
        // if value is please-select then set to ''
        userDropDownName: selectedOption.dataset.id === 'please-select' && '',
      }))
    }
  }

  if (loading) {
    return <Loading />
  }

  // if no auth then lock screen
  if (isRejected === true) {
    return <NotAuthorized errMSG={errMSG} />
  }
  return (
    <div className="page-container admin-new-blog-container">
      {/* <BackButton /> */}

      {/* if  publish: false then return ... this article is not ready yet */}
      <section className="admin-blog-form-container">
        {' '}
        <div className="admin-blog-form-container-right-div">
          <div className="admin-blog-icon-div">
            <i className="admin-blog-icon fa-solid fa-blog"></i>
          </div>
          <div>
            <p>hello {user.name}</p>
            <p>create a new blog for any user</p>
          </div>
          <p>new blog for: {userDropDownName && userDropDownName}</p>
          <p>
            user id: <span className="user-id">{userDropDownID && userDropDownID}</span>
          </p>

          {showToast && (
            <div className="created-toast"> blog created for {userDropDownName}</div>
          )}
        </div>
        <div>
          {' '}
          <form onSubmit={onSubmit} className="form new-blog-form-admin">
            <div className="form-group user-select-dropdown-wrap">
              <select
                className="admin-user-create-dropdown"
                ref={userDropDown}
                onChange={handleUserSelect}
                name="userDropDown"
                id="userDropDown"
              >
                {/* do the checks to see if it matches data-id */}
                <option data-id="please-select">please select author</option>
                {users &&
                  users.map((user) => (
                    <option
                      data-id={user._id}
                      key={user._id}
                      id={user._id} // needed to send to db
                      value={user._name}
                    >
                      {user.name}
                    </option>
                  ))}
              </select>
              <i className="dropdown-chevron fa-solid fa-chevron-down"></i>
            </div>

            <div className="form-group">
              {/* to do: looop through inputs dynamicly */}
              <input
                type="text"
                id="author"
                value={userDropDownName}
                onChange={onChange}
                className="form-input"
                name="author"
                placeholder="Blog Author"
                disabled={true}
                // required
              />
            </div>
            <div className="form-group">
              <input
                type="blogTitle"
                id="blogTitle"
                value={blogTitle}
                onChange={onChange}
                className="form-input"
                name="blogTitle"
                placeholder="Blog BlogTitle"
                // required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                id="country"
                value={country}
                onChange={onChange}
                className="form-input"
                name="country"
                placeholder="Blog Country"
                autoComplete="on"
                // required
              />
            </div>

            <div className="form-group">
              <textarea
                name="blogBody"
                onChange={onChange}
                id="blogBody"
                value={blogBody}
                className="form-input blog-input-body"
                placeholder="Blog Text"
              ></textarea>
            </div>

            <div className="form-group">
              <label className="check-form-control">
                <input
                  onChange={onChange}
                  id="featured"
                  type="checkbox"
                  name="featured"
                  value={false}
                  checked={featured}
                />
                featured
              </label>

              <label className="check-form-control">
                <input
                  onChange={onChange}
                  type="checkbox"
                  id="publish"
                  name="publish"
                  value={false}
                  checked={publish}
                />
                publish
              </label>
            </div>

            {/* RE-FACTOR THIS AND ADMIN */}
            {/* <input className="file-input" type="file" name="files[]" multiple /> */}
            <div className="form-group image-select-btn-wrap">
              {/* Hidden file input for images */}
              <input
                type="file"
                accept="image/*"
                multiple
                ref={imagesInputRef}
                style={{ display: 'none' }}
                onChange={handleImagesChange}
              />
              <button
                type="button"
                className="select-images-btn"
                onClick={triggerImagesSelect}
              >
                Images
              </button>

              {/* Hidden file input for hero image */}
              <input
                type="file"
                accept="image/*"
                ref={heroImageInputRef}
                style={{ display: 'none' }}
                onChange={handleHeroImageChange}
              />
              <button
                type="button"
                className="select-images-btn"
                onClick={triggerHeroImageSelect}
              >
                Hero
              </button>

              {images.length > 0 && (
                <div>
                  <h4>Selected Images:</h4>
                  <ul>
                    {images.map((file, index) => (
                      <li className="file-li-item" key={index}>
                        {file.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {heroImage && (
                <div className="file-li-item">
                  <h4>Selected Hero Image:</h4>
                  <p>{heroImage.name}</p>
                </div>
              )}
            </div>

            <div className="form-group form-btn-container create-blog-btn-container">
              <button
                onClick={handleClearForm}
                type="button"
                className="form-btn clear-blog-text-btn create-blog-btn"
              >
                clear all
              </button>
              <button className="form-btn create-blog-btn">create blog</button>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}

export default CreateBlogAdmin
