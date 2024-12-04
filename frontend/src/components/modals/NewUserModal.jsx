import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setNewUserModal } from '../../features/blog/blogSlice'
import { registerAsAdnin } from '../../features/auth/authSlice'
import CustomAlert from '../alerts/CustomAlert'
import { getAllUsersAdmin, setUsers } from '../../features/admin/adminSlice'
import { useNavigate } from 'react-router-dom'

function NewUserModal() {
  const navigate = useNavigate()
  const [type, setType] = useState('password')
  const [showAlert, setshowAlert] = useState(false)
  const [alertMSG, setalertMSG] = useState('')
  const [alertClr, setalertClr] = useState('')

  const [state, setstate] = useState(false)
  const dispatch = useDispatch()
  const { createNewUserModal } = useSelector((state) => state.blogs)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
    isSuspended: false,
    isAdmin: false,
  })
  const { name, email, password, password2, isSuspended, isAdmin } = formData

  const onMutate = (e) => {
    const { name, type, checked, id, placeholder } = e.target

    setFormData((prevState) => ({
      ...prevState,
      [id]: type === 'checkbox' ? checked : e.target.value,
    }))
  }

  const handleClose = () => {
    dispatch(setNewUserModal(!createNewUserModal))
  }

  const onSubmit = (e) => {
    e.preventDefault()
    if (password !== password2) {
      console.log('passwords do not match ')
      showAlertFunc(true, 'Passwords must match... ', 'black')
      return
    } else {
      const newUser = {
        name: name.trim(),
        email,
        password,
        isSuspended,
        isAdmin,
      }
      // THIS WAS THE PROBLEM **************

      dispatch(registerAsAdnin(newUser))
        .unwrap()
        .then((data) => {
          // console.log(data)
          handleClose()
        })
        .then(() => {
          const users = dispatch(getAllUsersAdmin())
          return users
        })
        .then((data) => {
          dispatch(setUsers(data.payload))
          navigate('/admin-users')
        })
        .catch((err) => {
          showAlertFunc(true, err, 'grey')
          setTimeout(() => {
            setshowAlert(false)
          }, 2000)
        })
    }
  }

  const showAlertFunc = (show, msg, clr) => {
    setshowAlert(show)
    setalertMSG(msg)
    setalertClr(clr)

    setTimeout(() => {
      setshowAlert(false)
      setalertMSG(' ')
    }, 4000)
  }

  return (
    <div className="modal-container">
      <div className="modal">
        <h3 className="admin-h3 admin-user-h3">
          <span>add a new user - admin only</span>
        </h3>
        {showAlert && <CustomAlert msg={alertMSG} clr={alertClr} />}
        <button onClick={handleClose} className="close-modal-btn">
          cancel
        </button>
        <div className="modal-body">
          <form onSubmit={onSubmit}>
            <div className="admin-controls-div">
              <label className=" admin-check-label">
                <input
                  className="admin-check"
                  onChange={onMutate}
                  type="checkbox"
                  name="isSuspended"
                  id="isSuspended"
                  value={false}
                  checked={isSuspended}
                />
                suspended
              </label>
              <label className=" admin-check-label">
                <input
                  className="admin-check"
                  onChange={onMutate}
                  type="checkbox"
                  name="isAdmin"
                  id="isAdmin"
                  value={false}
                  checked={isAdmin}
                />
                admin
              </label>
            </div>

            <div className="modal-form-control">
              <label className="update-label" htmlFor="blogTitle">
                User Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className="modal-input"
                placeholder="Enter Name"
                value={name}
                onChange={onMutate}
              />
            </div>

            <div className="modal-form-control">
              <label className="update-label" htmlFor="author">
                User Email
              </label>

              <input
                id="email"
                name="email"
                type="text"
                className="modal-input"
                placeholder="Enter Email"
                value={email}
                onChange={onMutate}
              />
            </div>

            <div className="modal-form-control">
              <label className="update-label" htmlFor="author">
                Enter Password
              </label>
              <div className="password-input-wrap">
                <input
                  id="password"
                  name="password"
                  type={type}
                  className="modal-input"
                  placeholder="Enter Password"
                  value={password}
                  onChange={onMutate}
                  autoComplete="true"
                />
              </div>
            </div>

            <div className="modal-form-control">
              <label className="update-label" htmlFor="author">
                Confirm Password
              </label>
              <div className="password-input-wrap">
                <input
                  id="password2"
                  name="password2"
                  type={type}
                  className="modal-input"
                  placeholder="Confirm Password"
                  value={password2}
                  onChange={onMutate}
                  autoComplete="true"
                />
              </div>
            </div>

            <div className="modal-form-control update-modal-btn-container">
              <button className="update-modal-btn">create new user</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default NewUserModal
