import hero from '../img/temp-imgs/hero.jpg'
import { useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { deleteBlogImg, setBLog, updatBlogImg } from '../features/blog/blogSlice'
const MsgHeroItem = () => {
  const dispatch = useDispatch()
  const fileInputRef = useRef(null) // Create a ref for the file input
  const { blogID } = useParams()

  const { blog } = useSelector((state) => state.blogs)

  const { imageData } = blog || {}
  const { heroImage } = imageData || []

  console.log(heroImage)

  // use state
  const heroID = heroImage?.id

  const handleUpdateClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      console.log(file)
      handleUpdateImg(file)
    }
  }

  const handleUpdateImg = async (file) => {
    const formData = new FormData()
    formData.append('image', file)
    formData.append('imgID', heroID)
    formData.append('blogID', blogID)
    formData.append('hero', true)

    formData.forEach((i) => console.log(i))

    try {
      const res = await dispatch(updatBlogImg(formData)).unwrap()
      dispatch(setBLog(res.blog))
    } catch (error) {
      console.log(error)
    }
  }

  const handleDeleteImg = () => {
    console.log('handle delete image id', heroID)
    dispatch(deleteBlogImg({ imgID: heroID, blogID, deleteHero: true }))
    const { id, url, ...remainingHeroImage } = blog.imageData.heroImage

    const data = {
      ...blog,
      imageData: {
        ...blog.imageData,
        heroImage: remainingHeroImage, // `id` and `url` are excluded (as we use the spread ...remainingHeroImage )
      },
    }
    dispatch(setBLog(data))
  }

  // hero image is hard coded
  return (
    <section className="hero-management-section">
      <p className="image-management-hero-p">hero image</p>

      <img className="hero-manage-img" src={heroImage?.url} alt="" />

      <div className="img-management-btn-container">
        <button onClick={handleUpdateClick} className="img-management-btn">
          Update
        </button>
        <button onClick={() => handleDeleteImg('id here')} className="img-management-btn">
          Delete
        </button>
        {/* Hidden file input */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </div>
    </section>
  )
}

export default MsgHeroItem
