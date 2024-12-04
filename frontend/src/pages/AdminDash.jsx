import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import NewUserModal from '../components/modals/NewUserModal'
import { useSelector, useDispatch } from 'react-redux'
import { setNewUserModal } from '../features/blog/blogSlice'
import { getUserAdmin } from '../features/admin/adminSlice'
import NotAuthorized from '../components/NotAuthorized'
import { scrollTop } from '../utils'
function AdminDash() {
  const dispatch = useDispatch()
  const [loggedInUser, setloggedInUser] = useState(null)
  const [IsError, setIsError] = useState(false)

  const [errMSG, setErrMSG] = useState('')

  const { createNewUserModal } = useSelector((state) => state.blogs)
  const { user } = useSelector((state) => state.auth)

  const handleNewUserToggle = () => {
    dispatch(setNewUserModal(!createNewUserModal))
  }

  useEffect(() => {
    scrollTop()

    const userData = async () => {
      try {
        const data = await dispatch(getUserAdmin(user.id)).unwrap()

        setloggedInUser(data)
      } catch (error) {
        setIsError(true)
        setErrMSG(error)
      }
    }

    userData()
    return () => {
      dispatch(setNewUserModal(false))
    }
  }, [])

  if (IsError) {
    return <NotAuthorized errMSG={errMSG} />
  }

  return (
    <>
      <section className="admin-dash-header-div">
        <span>welcome {user && user.name} to your admin dash</span>
      </section>

      <section className="page-container admin-dash-page-container">
        {createNewUserModal && <NewUserModal />}
        <div className="admin-dash-item-container">
          <div className="admin-dash-item">
            <Link to="/admin-blogs" className="admin-link">
              <div className="admin-link-box link-box-blogs">
                <p className="admin-link-p">
                  blogs
                  <span className="admin-link-span">manage</span>
                </p>
                <i className="blog-icon fa-solid fa-blog"></i>
              </div>
            </Link>
          </div>

          <div className="admin-dash-item">
            <Link to="/admin-users" className="admin-link">
              <div className="admin-link-box link-box-users">
                <p className="admin-link-p">
                  users
                  <span className="admin-link-span">manage</span>
                </p>
                <i className="users-icon fa-solid fa-users"></i>
              </div>
            </Link>
          </div>

          <div className="admin-dash-item">
            <button onClick={handleNewUserToggle} className="admin-link-btn">
              <div className="admin-link-box link-box-new-user">
                <p className="admin-link-p">
                  new user
                  <span className="admin-link-span">create</span>
                </p>
                <i className="plus-icon fa-solid fa-plus"></i>
              </div>
            </button>
          </div>

          <div className="admin-dash-item">
            <Link to="/admin-new-blog" className="admin-link-btn">
              <div className="admin-link-box link-box-new-blog">
                <p className="admin-link-p">
                  new blog
                  <span className="admin-link-span">create</span>
                </p>
                <i className="pen-icon fa-solid fa-pen-nib"></i>
              </div>
            </Link>
          </div>

          <div className="admin-dash-item">
            <Link className="admin-link-btn" to="/view-sent-emails">
              <div className="admin-link-box link-box-sent-emails ">
                <p className="admin-link-p">
                  sent emails
                  <span className="admin-link-span">check</span>
                </p>
                <i className="email-icon fa-solid fa-envelope-open-text"></i>
                {/* <i className="email-icon fa-solid fa-envelope"></i> */}
              </div>
            </Link>
          </div>

          <div className="admin-dash-item">
            <Link className="admin-link-btn" to="/email-page">
              <div className="admin-link-box link-box-view-emails ">
                <p className="admin-link-p">
                  email signups
                  <span className="admin-link-span">view</span>
                </p>
                <i className="email-icon fa-solid fa-envelope"></i>
              </div>
            </Link>
          </div>

          <div className="admin-dash-item">
            <Link className="admin-link-btn" to="/msg-page">
              <div className="admin-link-box link-box-view-messages ">
                <p className="admin-link-p">
                  messages
                  <span className="admin-link-span">view</span>
                </p>
                <i className="email-icon fa-solid fa-message"></i>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

export default AdminDash
