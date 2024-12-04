import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import AdminItem from '../components/AdminItem'

import UpdateBlogModalAdmin from '../components/modals/UpdateBlogModalAdmin'
import DeleteBlogModalAdmin from '../components/modals/DeleteBlogModalAdmin'
import NotAuthorized from '../components/NotAuthorized'
import {
  getAdminBlogs,
  toggleUpdateModal,
  toggleDeleteModal,
} from '../features/blog/blogSlice'
import BackButton from '../components/BackButton'
import MobileBackBTN from '../components/MobileBackBTN'
import AdminBlogsSearchBar from '../components/search components/AdminBlogsSearchBar'
import GlobalPageLoader from '../components/loaders/GlobalPageLoader'

// Helper function
import { scrollTop } from '../utils'

function Admin() {
  const { adminBlogs, showUpdateModal, showDeleteModal, errMSG, isError } = useSelector(
    (state) => state.blogs
  )

  const [isDeleting, setIsDeleting] = useState(false)
  const [loading, setLoading] = useState(false)

  const {
    user: { name },
  } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getAdminBlogs())
    scrollTop()
  }, [])

  useEffect(() => {
    return () => {
      dispatch(toggleUpdateModal(false))
      dispatch(toggleDeleteModal(false))
    }
  }, [])

  if (isError) {
    return <NotAuthorized errMSG={errMSG} />
  }

  if (!adminBlogs || loading) {
    return <GlobalPageLoader isDeleting={isDeleting} />
  }

  return (
    <div className="page-container admin-page-container">
      <div className="admin-back-btn-container">
        <BackButton />
      </div>
      <div className="admin-back-btn-mobile-container">
        <MobileBackBTN />
      </div>
      {showUpdateModal && <UpdateBlogModalAdmin />}
      <section className="admin-page-header">
        <h1 className="admin-page-h1">
          admin page
          <p className="">for all blog articles</p>
        </h1>
        <p className="logged-in-as">
          <span>logged in as {name}</span>
        </p>
      </section>

      {showDeleteModal && (
        <DeleteBlogModalAdmin
          loading={loading}
          setLoading={setLoading}
          setIsDeleting={setIsDeleting}
        />
      )}

      <div className="search-admin-blogs-container">
        <AdminBlogsSearchBar />
      </div>
      <section className="admin-section">
        <div className="admin-header-div">
          <div className="admin-item-inner-div">item</div>
          <div className="admin-item-inner-div">written</div>
          <div className="admin-item-inner-div">author</div>
          <div className="admin-item-inner-div">views</div>
          <div className="admin-item-inner-div">blogTitle</div>
          <div className="admin-item-inner-div">category</div>
          <div className="admin-item-inner-div">edited</div>
          <div className="admin-item-inner-div">featured</div>
          <div className="admin-item-inner-div">buttons</div>
        </div>
        {adminBlogs &&
          adminBlogs.length > 0 &&
          adminBlogs.map((blog, index) => {
            return <AdminItem key={blog._id} blog={blog} index={index} />
          })}
      </section>
    </div>
  )
}

export default Admin
