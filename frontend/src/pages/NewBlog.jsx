import { useState, useEffect, useRef } from 'react'
import { getCurrentUSer } from '../features/users/userSlice'
import { useSelector, useDispatch } from 'react-redux'
import MiddelCollumnAdvert from '../components/advert components/MiddelCollumnAdvert'
import { createBlog } from '../features/blog/blogSlice'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import Loading from '../components/loaders/Loading'
import holdImg from '../img/blog-advert-1.jpg'
import holdImg2 from '../img/blog-advert-2.jpg'
import NotAuthorized from '../components/NotAuthorized'

import MobileBackBTN from '../components/MobileBackBTN'

import { scrollTop } from '../utils'

function NewBlog() {
  const imagesInputRef = useRef(null)
  const heroImageInputRef = useRef(null)

  const [images, setImages] = useState([])
  const [heroImage, setHeroImage] = useState(null)

  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    author: '',
    blogTitle: '',
    country: '',
    blogBody: '',
    featured: false,
    publish: false,
    status: '',
  })

  const { user } = useSelector((state) => state.auth)
  const { isError, errMSG } = useSelector((state) => state.user)
  const { name } = user

  useEffect(() => {
    scrollTop()

    return () => {}
  }, [])

  useEffect(() => {
    dispatch(getCurrentUSer())
    setPageLoading(false)
  }, [])

  const { blogTitle, country, blogBody, featured, publish } = formData

  const onChange = (e) => {
    const { name, type, checked, id, placeholder } = e.target
    // Update state based on checkbox type
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : e.target.value, // Set value for checkboxes based on checked state, otherwise use regular value
    }))
  }

  const triggerImagesSelect = () => {
    if (imagesInputRef.current) {
      imagesInputRef.current.click()
    }
  }

  const triggerHeroImageSelect = () => {
    if (heroImageInputRef.current) {
      heroImageInputRef.current.click()
    }
  }

  const handleImagesChange = (e) => {
    const selectedFiles = Array.from(e.target.files)
    setImages(selectedFiles)
  }

  const handleHeroImageChange = (e) => {
    const selectedFile = e.target.files[0]
    console.log(selectedFile)
    setHeroImage(selectedFile)
  }

  // ** leave for reference *** //
  // Append the uploaded files
  // const files = document.querySelector('[type=file]').files
  // for (let i = 0; i < files.length; i++) {
  //   formData.append('images', files[i]) // Append each file
  // }

  const onSubmit = async (e) => {
    setLoading(true)
    e.preventDefault()

    const formData = new FormData()

    // Append text data
    formData.append('author', user.name)
    formData.append('blogTitle', blogTitle)
    formData.append('country', country)
    formData.append('blogBody', blogBody)
    formData.append('featured', featured)
    formData.append('publish', publish)

    // Append hero image
    if (heroImage) {
      formData.append('heroImage', heroImage)
    }

    // Append other images
    if (images.length > 0) {
      images.forEach((image) => {
        formData.append('images', image) // 'images' field  will collect all image files
      })
    }

    try {
      const res = await dispatch(createBlog(formData)).unwrap()

      toast.success('Success! Blog created')
      setLoading(false)
      handleClearForm()
      navigate(`/user-blog/${res._id}`)
    } catch (error) {
      toast.error('Failed to create blog')
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
  }

  if (loading) {
    return <Loading />
  }

  if (isError === true) {
    return <NotAuthorized errMSG={errMSG} />
  }

  return (
    <div className="page-container new-blog-container">
      {loading && <Loading />}
      <section className="new-blog-header">
        <h1>welcome {name && name} </h1>
        <p>let's create a new blog</p>
      </section>

      <section className="new-blog-grid-container">
        <div className="content-box side-box">
          <img className="new-blog-side-img" src={holdImg} alt="" />
        </div>
        <div className="content-box">
          <MobileBackBTN />
          <section className="register-form-section new-blog-section">
            <div className="holding-box"></div>
            <div className="holding-box">
              <form onSubmit={onSubmit} className="form new-blog-form">
                <div className="form-group">
                  {/* LOOP THROUGH INPUTS DYNAMICLY */}
                  <input
                    type="text"
                    id="author"
                    value={user.name}
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
                    placeholder="Enter BlogTitle"
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
                    placeholder="Enter Country"
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
                      name="publish"
                      value={false}
                      checked={publish}
                    />
                    publish
                  </label>
                </div>

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
              <MiddelCollumnAdvert />
            </div>

            <div className="holding-box"></div>
          </section>
        </div>
        <div className="content-box side-box">
          <img className="new-blog-side-img" src={holdImg2} alt="" />
        </div>
      </section>
    </div>
  )
}

export default NewBlog
