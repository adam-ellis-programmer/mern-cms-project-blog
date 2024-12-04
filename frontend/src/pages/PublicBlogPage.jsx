import { images } from '../img/temp-imgs/tempImgs'
import { useState, useEffect, useLayoutEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { useParams, Link } from 'react-router-dom'

import {
  toggleUpdateModal,
  toggleDeleteModal,
  getPublicBlog,
  updatePublicBlog,
  resetErr,
  resetBlog,
} from '../features/blog/blogSlice'

import UpdateBlogModal from '../components/modals/UpdateBlogModal'
import DeleteBlogModal from '../components/modals/DeleteBlogModal'
import NotAuthorized from '../components/NotAuthorized'
import GlobalPageLoader from '../components/loaders/GlobalPageLoader'
import { scrollTop } from '../utils'
function PublicBlogPage() {
  const [showSuccessMSG, setshowSuccessMSG] = useState(false)
  const [copyMSG, setCopyMSG] = useState('')

  // on page load scroll to top
  useEffect(() => {
    scrollTop()

    // on page leave
    return () => {
      dispatch(resetErr())
      dispatch(resetBlog())
    }
  }, [])

  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(window.location.href)
      console.log('URL copied successfully!')
      setshowSuccessMSG(true)
      setCopyMSG('link copied success!')
      setTimeout(() => {
        setshowSuccessMSG(false)
        setCopyMSG('')
      }, 2500)
    } catch (err) {
      console.error('Failed to copy URL:', err)
    }
  }

  const { blogID } = useParams()

  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  // console.log(user)
  const { publicBlog, showUpdateModal, showDeleteModal, isError, errMSG } = useSelector(
    (state) => state.blogs
  )

  // *** leave for reference *** //
  // useEffect(() => {
  //   const views = publicBlog && publicBlog
  //   dispatch(updatePublicBlog({ id: blogID, data: { ...views, views: views + 1 } }))
  //   console.log(views)
  //   // return () => {}
  // }, [])
  // const imageUrls = publicBlog && publicBlog.images

  const { imageData } = publicBlog ?? {}
  const imageUrls = imageData?.imageUrls ?? []

  // truthy and falsy ?? {}
  // if no public blog then return a {} empty object to stop error
  const { blogBody, country, blogTitle, status, edited, author, userID, views } =
    publicBlog ? publicBlog : {}

  const [wordCount, setWordCount] = useState(100)

  // console.log(blogBody && blogBody.split(' '))
  useEffect(() => {
    dispatch(getPublicBlog(blogID))
      .unwrap()
      .then((data) => {
        dispatch(
          updatePublicBlog({ id: blogID, data: { ...data, views: data.views + 1 } })
        )

        console.log(data)
      })
      .catch((err) => console.log(err))
  }, [blogID, isError])

  const [chunks, setChunks] = useState(null)

  // set the chunks of data for formatting
  useEffect(() => {
    if (blogBody) {
      const blogWords = blogBody && blogBody.split(' ')
      const chunks = []
      let currentChunk = []

      for (let i = 0; i < blogWords.length; i++) {
        currentChunk.push(blogWords[i])

        if (currentChunk.length === wordCount || i === blogWords.length - 1) {
          chunks.push(currentChunk.join(' '))
          currentChunk = []
        }
      }

      setChunks(chunks)
    }
  }, [blogBody, wordCount])

  // sets word count depending on page width
  useLayoutEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1300) {
        setWordCount(150)
      } else {
        setWordCount(100)
      }
    }

    window.addEventListener('resize', handleResize)

    // Cleanup function to remove event listener on unmount
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleToggleUpdate = () => {
    dispatch(toggleUpdateModal(!showUpdateModal))
  }
  const handleToggleDelete = () => {
    dispatch(toggleDeleteModal(!showDeleteModal))
  }

  let chunkCount = 0
  let imgCount = 0

  // handle scroll click
  const handleScrollClick = (e) => {
    window.scrollTo({
      left: 0,
      top: 0,
    })
  }
  if (isError === true) {
    return <NotAuthorized errMSG={errMSG} />
  }

  if (!publicBlog) {
    return <GlobalPageLoader />
  }

  return (
    <div className="page-container blog-page-container">
      {showUpdateModal && <UpdateBlogModal />}
      <div className="blog-page-hero">
        {showDeleteModal && <DeleteBlogModal />}
        <img className="hero-img" src={imageData && imageData?.heroImage?.url} alt="" />

        <div className="blog-post-title-div">
          <p>{blogTitle}</p>
          <p>by {author}</p>
        </div>

        <div className="blog-post-country-div">
          <p>{country && country.toLowerCase()}</p>
        </div>

        <div className="copy-link-div">
          {showSuccessMSG && <p className="link-copied-p">l{copyMSG}</p>}
          <button onClick={handleCopyLink} className="copy-link-btn">
            <i className=" copy-link-icon fa-solid fa-link"></i>
          </button>
        </div>
      </div>

      <section className="blog-page-info">
        <h2>Blog Written By {author}</h2>
        <p>{blogTitle}</p>
        <p>views {views}</p>

        <div className="blog-controls-container">
          {/* userId is the id on the public blog */}
          {user && user.id === userID && (
            <>
              <button onClick={handleToggleUpdate} className="update-blog-btn blog-btn">
                update
              </button>
              <button onClick={handleToggleDelete} className="delete-blog-btn blog-btn">
                {showDeleteModal ? 'close' : 'delete'}
              </button>

              {/* manage images page link */}
              <Link className="blog-btn" to={`/manage-images/${blogID}`}>
                images
              </Link>
            </>
          )}
        </div>
      </section>

      <section className="blog-page-content-container">
        <div className="blog-post ">
          {chunks &&
            chunks.map((paragraph, index) => {
              if (imageUrls && imageUrls[index]?.url) {
                {
                  chunkCount++
                  console.log(chunkCount)
                }
                // Check if image exists for this paragraph
                return (
                  <div
                    key={index}
                    className={`post-section  ${index % 2 === 0 && 'alternate'}`}
                  >
                    <div className={`side-img-container ${index % 2 && 'alt-img'}`}>
                      <img src={imageUrls[index]?.url} alt="" className="side-img" />
                    </div>

                    <div className="side-text-container">
                      <p>{paragraph}</p>
                    </div>
                  </div>
                )
              } else {
                return null // Don't render anything if no image
              }
            })}
          <div className="extra-text-container">
            {chunks &&
              chunks.length > chunkCount &&
              chunks.slice(chunkCount).map((paragraph, index) => {
                return (
                  <p key={index} className="extra-text-paragraph">
                    {paragraph}
                  </p>
                )
              })}
          </div>

          <div className="extra-img-container">
            {imageUrls &&
              imageUrls.length > chunkCount &&
              imageUrls.slice(chunkCount).map((img, index) => {
                return (
                  <img
                    key={index}
                    src={img?.url}
                    alt=""
                    className="side-img bottom-img"
                  />
                )
              })}
          </div>
        </div>

        {/*   delete contianer */}
        <div className="scroll-up-cotainer">
          <button onClick={handleScrollClick} className="scroll-up-btn">
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </section>
    </div>
  )
}

export default PublicBlogPage
