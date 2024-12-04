import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  getUserBlog,
  setBLog,
  deleteBlogImg,
  updatBlogImg,
  addBulkImages,
  deleteAllImages,
} from '../features/blog/blogSlice'
import ImageItem from '../components/ImageItem'
import DeleteAllImagesModal from '../components/modals/DeleteAllImagesModal'

import MsgHeroItem from '../components/MsgHeroItem'

import GlobalPageLoader from '../components/loaders/GlobalPageLoader'
import { scrollTop } from '../utils'
const ManageImages = () => {
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)

  const { blogID } = useParams()
  const { blog } = useSelector((state) => state.blogs)

  const { imageData } = blog || {}
  const { imageUrls } = imageData || []

  const dispatch = useDispatch()
  const fileInputRef = useRef(null) // Create a ref for the file input

  useEffect(() => {
    scrollTop()
    dispatch(getUserBlog(blogID)).then((data) => {
      setLoading(false)
    })
  }, [blogID, dispatch])

  //
  const handleDeleteImg = (imgID) => {
    dispatch(deleteBlogImg({ imgID, blogID }))

    // Update the local state
    const images = imageUrls.filter((i) => i.id !== imgID)

    const data = {
      ...blog,
      // update nested data
      imageData: {
        ...blog.imageData,
        imageUrls: images,
      },
    }
    dispatch(setBLog(data))
  }

  // use form data object to construct data for multer upload
  const handleUpdateImg = async (imgID, file) => {
    const formData = new FormData()

    formData.append('image', file)
    formData.append('imgID', imgID)
    formData.append('blogID', blogID)

    try {
      const res = await dispatch(updatBlogImg(formData)).unwrap()
      dispatch(setBLog(res.blog))
    } catch (error) {
      console.log(error)
    }
  }

  const handleAddImages = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click() // Programmatically trigger the file input click
    }
  }

  const handleFileChange = async (event) => {
    const files = event.target.files
    if (files && files.length > 0) {
      const formData = new FormData()

      for (let i = 0; i < files.length; i++) {
        formData.append('images', files[i]) // Append each file to FormData under the key 'images'
      }

      formData.append('blogID', blogID)

      try {
        const res = await dispatch(addBulkImages(formData)).unwrap()
        dispatch(setBLog(res.blog))
      } catch (error) {
        console.log(error)
      }
    }
  }

  const handleModal = async () => {
    setShowModal(!showModal)
  }

  if (loading) {
    return <GlobalPageLoader />
  }
  return (
    <>
      {showModal && (
        <DeleteAllImagesModal
          setShowModal={setShowModal}
          deleteAllImages={deleteAllImages}
        />
      )}
      <div className="page-container blog-page-container">
        <section className="img-management-header">
          <div className="img-btn-management-container">
            <button className="add-images-btn" onClick={handleAddImages}>
              <span>add images</span>
              <i className="fa-solid fa-plus add-img-plus"></i>
            </button>

            <button className="add-images-btn" onClick={handleModal}>
              <span>delete all </span>
              <i className="fa-solid fa-trash"></i>
            </button>
          </div>
          {/* Hidden file input */}
          <input
            type="file"
            multiple
            accept="image/*"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </section>

        {blog?.imageData?.heroImage?.url && <MsgHeroItem />}

        <section className="img-management-grid">
          {imageUrls &&
            imageUrls.map((item) => (
              <ImageItem
                key={item.id}
                item={item}
                handleDeleteImg={handleDeleteImg}
                handleUpdateImg={handleUpdateImg}
              />
            ))}
        </section>
      </div>
    </>
  )
}

export default ManageImages
