import { useEffect, useRef, useState } from 'react'

import {
  getMe,
  updatePassword,
  updateEmail,
  updateName,
  updateUserProfileImage,
  setLoggedInUser,
} from '../features/users/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import { getDate, scrollTop } from '../utils'
import GlobalPageLoader from '../components/loaders/GlobalPageLoader'
import AccountAlert from '../components/AccountAlert'

import DeleteAccountAlert from '../components/DeleteAccountAlert'
import MyAccDeleteAlert from '../components/MyAccDeleteAlert'

import tempImg from '../img/user.png'
function MyAccount() {
  const { showDeleteAccAlert, user } = useSelector((state) => state.user)
  const [deleteID, setDeleteID] = useState('')
  const [deleteAlert, setDeleteAlert] = useState(false)
  const [alertMSG, setAlertMSG] = useState(null)
  const [alertType, setAlertType] = useState('')
  const [alertName, setAlertName] = useState('')
  const [alert, setAlert] = useState(null)

  const [formData, setFormData] = useState({
    oldPassWord: '',
    newPassWord: '',
    oldEmail: '',
    newEmail: '',
    confirmEmail: '',
    newName: '',
  })
  const fileInputRef = useRef(null)
  const { oldPassWord, newPassWord, oldEmail, newEmail, confirmEmail, newName } = formData
  const [userData, setUserData] = useState(null)

  const dispatch = useDispatch()
  useEffect(() => {
    scrollTop()
    return () => {}
  }, [])

  // on page load
  useEffect(() => {
    const getData = async () => {
      const data = await dispatch(getMe()).unwrap()
      setUserData(data)
      setDeleteID(data.id)
    }
    getData()
    return () => {}
  }, [])

  const onChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      // computed property names
      [name]: value,
    }))
  }

  const onChangePassWord = async (e) => {
    e.preventDefault()

    const passwordData = {
      oldPassWord,
      newPassWord,
    }

    try {
      // dispach object
      const res = await dispatch(updatePassword(passwordData)).unwrap()

      handleSuccess(res, 'password')
    } catch (error) {
      console.log(error)
      handleErr(error, 'password')
    }
  }

  const onChangeEmail = async (e) => {
    e.preventDefault()
    const data = {
      oldEmail,
      newEmail,
      confirmEmail,
    }

    if (newEmail !== '') {
      setUserData((prevState) => ({
        ...prevState,
        email: newEmail,
      }))
    }

    try {
      const res = await dispatch(updateEmail(data)).unwrap()

      handleSuccess(res, 'email')
    } catch (error) {
      console.log(error)
      handleErr(error, 'email')
    }
  }

  const onChangeName = async (e) => {
    e.preventDefault()
    const data = {
      newName,
    }

    // check name is not empty and > 4
    if (newName !== '' && newName.length > 4) {
      setUserData((prevState) => ({
        ...prevState,
        name: newName,
      }))
    }

    try {
      const res = await dispatch(updateName(data)).unwrap()
      handleSuccess(res, 'name')
    } catch (error) {
      console.log(error)
      handleErr(error, 'name')
    }
  }

  const handleDeletemodal = () => {
    setDeleteAlert(!deleteAlert)
    // make a survey on exit (why are you leaving)
  }

  const handleErr = (error, alertName) => {
    setAlertName(alertName)
    setAlertMSG(error)
    setAlertType('error')
    setAlert(true)
    setTimeout(() => {
      setAlert(false)
      setAlertMSG('')
      // resetFormData()
    }, 4000)
    console.log(error)
  }

  const handleSuccess = (res, alertName) => {
    setAlertName(alertName)
    setAlertMSG(res.msg)
    setAlertType('success')
    setAlert(true)
    setTimeout(() => {
      setAlert(false)
      setAlertMSG('')
    }, 4000)
    resetFormData()
  }

  const resetFormData = () => {
    setFormData((prevState) => ({
      ...prevState,
      oldPassWord: '',
      newPassWord: '',
      oldEmail: '',
      newEmail: '',
      confirmEmail: '',
      newName: '',
    }))
  }

  const handleImageChange = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = async (event) => {
    const file = event.target.files[0]
    if (file) {
      const formData = new FormData()
      formData.append('file', file) // 'file' matches the field name in upload.single('file')
      const res = await dispatch(updateUserProfileImage(formData)).unwrap()

      dispatch(setLoggedInUser(res.updatedUser))
    }
  }

  if (!userData) {
    return <GlobalPageLoader />
  }

  return (
    <div className="page-container my-account-container">
      <section className="my-account-header">
        <h1>my account page</h1>
        <p>view and manage your account here</p>
      </section>

      <section className="my-account-grid">
        <div>
          <p className="main-acc-info">
            <span>main account info</span>
            <img
              onClick={handleImageChange}
              className="profile-img"
              src={user?.avatar || tempImg}
              alt=""
            />

            {/* Hidden file input */}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </p>
          <div className="my-account-user-info-div">
            <div className="my-account-user-inner-div">
              <p>name: </p>
              <p>email: </p>
              <p>date of birth: </p>
              <p>admin: </p>
              <p>super admin: </p>
              <p>suspended: </p>
              <p>last Login Date: </p>
              <p>last Login Time: </p>
              <p>logins: </p>
              <p>blogs: </p>
              <p>featured blogs: </p>
              <p>tasks: </p>
              <p>sign up date: </p>
              <p>sign up time: </p>
              <p>last updated date: </p>
              <p>last updated time: </p>
            </div>

            <div className="my-account-user-inner-div">
              <p>
                <span className="my-acc-span">name</span> {user && user.name}
              </p>
              <p>
                <span className="my-acc-span">email</span> {user && user.email}
              </p>
              <p>
                <span className="my-acc-span">date of birth</span> {user && user.dob}
              </p>
              <p>
                <span className="my-acc-span">admin</span>{' '}
                {user && user.isAdmin ? 'yes' : 'no'}
              </p>
              <p>
                <span className="my-acc-span">super admin</span>{' '}
                {user && user.isSuperAdmin ? 'yes' : 'no'}
              </p>
              <p>
                <span className="my-acc-span">suspended</span>{' '}
                {user && user.isSuspended ? 'yes' : 'no'}
              </p>
              <p>
                <span className="my-acc-span">last loggin date</span>{' '}
                {user && user.lastLoginDate}
              </p>
              <p>
                <span className="my-acc-span">last login time</span>{' '}
                {user && user.lastLoginTime}
              </p>
              <p>
                <span className="my-acc-span">number of logins</span>{' '}
                {user && user.logins}
              </p>
              <p>
                <span className="my-acc-span">mumber of blogs</span> {user && user.blogs}
              </p>
              <p>
                <span className="my-acc-span">number of featured blogs</span>{' '}
                {user && user.featuredBlogs}
              </p>
              <p>
                <span className="my-acc-span">number of tasks</span> {user && user.tasks}
              </p>

              <p>
                <span className="my-acc-span">sign up date</span>
                {new Date(user.createdAt).toLocaleString('en-GB').slice(0, 10)}
              </p>

              <p>
                <span className="my-acc-span">sign up time</span>
                {new Date(user.createdAt).toLocaleString('en-GB').slice(11)}
              </p>
              {/* last updated */}
              <p>
                <span className="my-acc-span">last updated date</span>
                {new Date(user.updatedAt).toLocaleString('en-GB').slice(0, 10)}
              </p>
              {/**up to but not including  */}
              <p>
                <span className="my-acc-span">last updated time</span>
                {new Date(user.updatedAt).toLocaleString('en-GB').slice(11)}
              </p>
            </div>
          </div>
        </div>
        <div className="my-account-password-reset-div">
          <section className="my-account-section">
            <p className="change-pw-p">
              {' '}
              <span>change your password</span>
            </p>
            <form onSubmit={onChangePassWord}>
              {alert && alertName === 'password' && (
                <AccountAlert alertMSG={alertMSG} alertType={alertType} />
              )}
              <div className="reset-form-group">
                <input
                  onChange={onChange}
                  type="text"
                  name="oldPassWord"
                  className="password-reset-input"
                  placeholder="enter old password"
                  value={oldPassWord}
                />
              </div>
              <div className="reset-form-group">
                <input
                  onChange={onChange}
                  type="text"
                  name="newPassWord"
                  className="password-reset-input"
                  placeholder="enter new password"
                  value={newPassWord}
                />
              </div>
              <div className="change-pw-div">
                <button className="change-password-btn">change password</button>
              </div>
            </form>
          </section>

          <section className="my-account-section">
            <p className="change-pw-p">
              {' '}
              <span>change your email</span>
            </p>
            <form onSubmit={onChangeEmail}>
              {alert && alertName === 'email' && (
                <AccountAlert alertMSG={alertMSG} alertType={alertType} />
              )}

              <div className="reset-form-group">
                <input
                  onChange={onChange}
                  type="text"
                  name="oldEmail"
                  className="password-reset-input"
                  placeholder="enter old email"
                  value={oldEmail}
                />
              </div>
              <div className="reset-form-group">
                <input
                  onChange={onChange}
                  type="text"
                  name="newEmail"
                  className="password-reset-input"
                  placeholder="enter new email"
                  value={newEmail}
                />
              </div>
              <div className="reset-form-group">
                <input
                  onChange={onChange}
                  type="text"
                  name="confirmEmail"
                  className="password-reset-input"
                  placeholder="confirm new email"
                  value={confirmEmail}
                />
              </div>
              <div className=" change-pw-div">
                <button className="change-password-btn">change email</button>
              </div>
            </form>
          </section>

          {/* change name */}
          <section className="my-account-section">
            <p className="change-pw-p">
              {' '}
              <span>change your name</span>
            </p>
            <form onSubmit={onChangeName}>
              {alert && alertName === 'name' && (
                <AccountAlert alertMSG={alertMSG} alertType={alertType} />
              )}

              <div className="reset-form-group">
                <input
                  onChange={onChange}
                  type="text"
                  name="newName"
                  className="password-reset-input"
                  placeholder="enter new name"
                  value={newName}
                />
              </div>
              <div className="change-pw-div">
                <button className="change-password-btn">change name</button>
              </div>
            </form>
          </section>

          {/* if in loop then check index 
            this way we check another condition
          */}
          <section className="my-account-section">
            {showDeleteAccAlert && <MyAccDeleteAlert />}

            {deleteAlert && (
              <DeleteAccountAlert setDeleteAlert={setDeleteAlert} deleteID={deleteID} />
            )}
            <div className="user-delete-user-btn-container">
              <button onClick={handleDeletemodal} className="delete-user-user-btn">
                {/* to animate this is use a callback fn () with if options */}
                {deleteAlert ? 'close' : 'delete profile'}
              </button>
            </div>
          </section>
        </div>
      </section>
    </div>
  )
}

export default MyAccount
