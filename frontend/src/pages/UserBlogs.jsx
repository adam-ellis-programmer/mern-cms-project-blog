import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getUserBlogs } from '../features/blog/blogSlice'
import BlogItem from '../components/BlogItem'
import { Link } from 'react-router-dom'
import PageLoader from '../components/loaders/PageLoader'
import BackButton from '../components/BackButton'
import MobileBackBTN from '../components/MobileBackBTN'
import NoDataPlaceHolder from '../components/place holder components/NoDataPlaceHolder'
import GlobalPageLoader from '../components/loaders/GlobalPageLoader'
import { scrollTop } from '../utils'

function UserBlogs() {
  const { blogs } = useSelector((state) => state.blogs)
  console.log(blogs)
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const [isLoading, setisLoading] = useState(true)
  const { name } = user

  useEffect(() => {
    scrollTop()
    dispatch(getUserBlogs())
    setisLoading(false)
  }, [dispatch])

  if (!blogs) {
    return <GlobalPageLoader />
  }
  return (
    <div className="page-container blogs-list-container">
      <div className="user-blogs-back-btn-container">
        <BackButton />
      </div>
      <div className="user-blogs-back-mobile-btn-container">
        <MobileBackBTN />
      </div>
      <section className="admin-page-header">
        <h1 className="admin-page-h1">
          <p className="">user blog page</p>
          <p className="">track and manage all your blogs </p>
          <p>in one place</p>
        </h1>
        <p className="logged-in-as">
          <span>logged in as {name}</span>
        </p>
      </section>

      <section className="blogs-table-section">
        <div className="blogs-header">
          <div className="blogs-header-item">created</div>
          <div className="blogs-header-item">last edited</div>
          <div className="blogs-header-item">views</div>
          <div className="blogs-header-item">country</div>
          <div className="blogs-header-item">blog title</div>
          <div className="blogs-header-item">status</div>
        </div>

        {blogs && blogs.length < 1 && <NoDataPlaceHolder data={{ page: 'blogs' }} />}
        {blogs && blogs.map((blog) => <BlogItem key={blog._id} blog={blog} />)}
      </section>
    </div>
  )
}

export default UserBlogs
