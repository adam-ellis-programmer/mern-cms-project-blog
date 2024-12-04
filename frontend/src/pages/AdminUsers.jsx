import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import UserItem from '../components/UserItem'
import UpdateUserModal from '../components/modals/UpdateUserModal'
import { getAllUsersAdmin } from '../features/admin/adminSlice'
import { setToggleUpdateModal } from '../features/admin/adminSlice'
import BackButton from '../components/BackButton'
import NotAuthorized from '../components/NotAuthorized'
import { useState } from 'react'
import MobileBackBTN from '../components/MobileBackBTN'
import UserSearchBar from '../components/search components/UserSearchBar'
import GlobalPageLoader from '../components/loaders/GlobalPageLoader'
import DeleteUserModal from '../components/modals/DeleteUserModal'
import { setNewUserModal } from '../features/blog/blogSlice'
import NewUserModal from '../components/modals/NewUserModal'
import NoDataPlaceHolder from '../components/place holder components/NoDataPlaceHolder'
import { scrollTop } from '../utils'

function AdminUsers() {
  const {
    toggleUpdateModal = false,
    isRejected,
    errMSG,
  } = useSelector((state) => state.admin)

  const dispatch = useDispatch()
  const { createNewUserModal } = useSelector((state) => state.blogs)
  const { users, showDeleteUserModal } = useSelector((state) => state.admin)
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    scrollTop()
  }, [])

  useEffect(() => {
    return () => {
      if (users && users.length < 1) {
        // refreshes the data on leave
        dispatch(getAllUsersAdmin())
      }
    }
  }, [users])

  useEffect(() => {
    dispatch(getAllUsersAdmin())
  }, [])

  useEffect(() => {
    return () => {
      dispatch(setToggleUpdateModal(false))
    }
  }, [])

  const handleToggleModal = () => {
    dispatch(setNewUserModal(!createNewUserModal))
  }

  // is rejected true / false
  // security
  // message: You are currently suspended please contact admin support!
  if (isRejected) {
    return <NotAuthorized errMSG={errMSG} />
  }

  if (!users) {
    return <GlobalPageLoader />
  }

  return (
    <div className="page-container admin-users-page-container">
      {createNewUserModal && <NewUserModal />}
      {showDeleteUserModal && <DeleteUserModal />}
      <div className="users-back-btn-container">
        <BackButton />
      </div>
      <div className="users-back-mobile-btn-container">
        <MobileBackBTN />
      </div>
      <section className="admin-page-header">
        <h1 className="admin-page-h1">
          admin page
          <p className="">for all users</p>
        </h1>
        <p className="logged-in-as">
          <span>logged in as {user.name}</span>
        </p>
        <div className="user-page-control-btn-container">
          <button onClick={handleToggleModal} className="add-new-user-page-btn">
            <span>new user</span> <i className="plus-btn fa-solid fa-plus"></i>
          </button>
          {/* <button onClick={handleToggleModal} className="add-new-user-page-btn">
            <span>ban user</span> <i className="plus-btn fa-solid fa-ban"></i>
          </button> */}
        </div>
      </section>

      <section className="search-users-container">
        <UserSearchBar />
      </section>
      <section className="users-admin-info">
        {toggleUpdateModal && <UpdateUserModal />}
        <div className="users-admin-header-div">
          <div className="user-header-div">admin</div>
          <div className="user-header-div">item</div>
          <div className="user-header-div">suspended</div>
          <div className="user-header-div">sign up</div>
          <div className="user-header-div">last login</div>
          <div className="user-header-div">name</div>
          <div className="user-header-div">email</div>
          <div className="user-header-div">controls</div>
        </div>
        {/* needs looking at to on page leave clear this state */}
        {users && users.length < 1 && <NoDataPlaceHolder data={{ page: 'users' }} />}
        {users &&
          users.length > 0 &&
          users.map((user, i) => <UserItem key={user._id} user={user} index={i} />)}
      </section>
    </div>
  )
}

export default AdminUsers
