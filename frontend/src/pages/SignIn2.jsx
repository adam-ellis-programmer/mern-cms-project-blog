import MiddelCollumnAdvert from '../components/advert components/MiddelCollumnAdvert'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { login } from '../features/auth/authSlice'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { getDate, scrollTop } from '../utils'
import { updateUserDate } from '../features/users/userSlice'
import { updateUSerState } from '../features/auth/authSlice'
import bg from '../img/bg.jpg'
import NotAuthorized from '../components/NotAuthorized'
function SignIn() {
  // on mount scroll to top
  useEffect(() => {
    scrollTop()
    return () => {}
  }, [])

  // font awsome icon references
  const eyeOff = 'fa-solid fa-eye'
  const eyeOn = 'fa-solid fa-eye-slash'

  const [showError, setShowError] = useState(false)
  const [passwordClass, setPasswordClass] = useState(eyeOff)
  const [passwordType, setPasswordType] = useState('password')
  const [errorMsg, setErrorMsg] = useState('')

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const { email, password } = formData

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const userData = {
      email,
      password,
    }

    dispatch(login(userData))
      .unwrap()
      .then((user) => {
        toast.success(`Signed in as: ${user.name}`)
        const date = getDate().date
        const time = getDate().time

        dispatch(
          updateUserDate({
            id: user.id,
            data: {
              ...user,
              lastLoginDate: date,
              lastLoginTime: time,
              // logins update is now handled on the server
              // logins: user.logins + 1,
            },
          })
        )
        // update state to keep in sync
        // ******* Now handled on the server ******* //
        // dispatch(updateUSerState({ ...user, logins: user.logins + 1 }))

        navigate('/')
      })
      .catch((err) => {
        setShowError(true)
        setErrorMsg(err)

        setTimeout(() => {
          setShowError(false)
          setErrorMsg('')
        }, 2500)
      })
  }

  const handleShowPassword = () => {
    console.log('clicked')

    if (passwordType === 'password') {
      setPasswordType('text')
      setPasswordClass(eyeOn)
    } else {
      setPasswordType('password')
      setPasswordClass(eyeOff)
    }
  }

  // if suspended we now lock the form rather than the page
  // if (showError) {
  //   return <NotAuthorized errMSG={errorMsg} />
  // }

  return (
    <>
      <div className="signin-container">
        <section className="login-form-section">
          <div className="login-wrap">
            <div className="holding-box holding-box-left">
              <h1 className="signin-h1">
                <p>
                  <i className="fa-solid fa-user"></i> sign in here
                </p>
                <p className="login-title-2">
                  login to your <span className="login-acount">account</span>{' '}
                </p>
              </h1>
            </div>

            <div className="holding-box login-holding-box">
              <form onSubmit={onSubmit} className="login-form">
                {showError && <div className="alert-login">{errorMsg}</div>}
                <div className="form-group login-form-group">
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={onChange}
                    className="form-input  form-input-login"
                    name="email"
                    placeholder="Enter Email"
                    // required
                  />
                </div>
                <div className="form-group login-form-group ">
                  <input
                    type={passwordType}
                    id="password"
                    value={password}
                    onChange={onChange}
                    className="form-input form-input-login"
                    name="password"
                    placeholder="Enter Password"
                    autoComplete="on"
                    // required
                  />
                  <i
                    onClick={handleShowPassword}
                    className={`view-password ${passwordClass}`}
                  ></i>
                </div>
                <div className="form-group login-form-group form-btn-container">
                  <button className="form-btn login-btn">log me in</button>
                </div>
                {/* <div className="forgot-pw-div">
                  <button type="button" className="forgot-pw-btn">
                    forgot password
                  </button>
                </div> */}
              </form>
            </div>
          </div>

          <div className="holding-box"></div>
        </section>
      </div>
    </>
  )
}

export default SignIn
