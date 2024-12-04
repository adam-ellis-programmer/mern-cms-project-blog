import { useState, useRef, useEffect } from 'react'
import MiddelCollumnAdvert from '../components/advert components/MiddelCollumnAdvert'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useSelector, useDispatch } from 'react-redux'
import { register, sendWelcomeEmails } from '../features/auth/authSlice'
import { formatedDOB, getDate, scrollTop } from '../utils'
import { emailSignUp } from '../features/users/userSlice'

function Register() {
  useEffect(() => {
    scrollTop()

    return () => {}
  }, [])
  // font awesome icon references
  const eyeOff = 'fa-solid fa-eye'
  const eyeOn = 'fa-solid fa-eye-slash'

  const [passwordType1, setPasswordType1] = useState('password') // For password field 1
  const [passwordType2, setPasswordType2] = useState('password') // For password field 2
  const [passwordClass1, setPasswordClass1] = useState(eyeOff) // For password field 1 icon
  const [passwordClass2, setPasswordClass2] = useState(eyeOff) // For password field 2 icon

  const [showError, setShowError] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
    dob: '',
    terms: false,
    emailList: false,
    day: '',
    month: '',
    year: '',
    tier: '',
  })
  const { name, email, password, password2, day, year, month, terms, emailList, tier } =
    formData

  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Refs to handle focus
  const monthInputRef = useRef(null)
  const yearInputRef = useRef(null)

  // Handling input change with auto-focus (auto moves to the next field)
  const onChange = (e) => {
    const { type, value, name, checked } = e.target

    // Ensure day and month only accept two digits max
    let parsedValue = value

    // hanling slice before it gets to render -- can be done on server??...
    if (name === 'day' || name === 'month') {
      parsedValue = value.slice(0, 2) // Limit to two digits
      // ensure number and auto set if max is exceded
      if (name === 'day' && Number(parsedValue) > 31) parsedValue = '31'
      if (name === 'month' && Number(parsedValue) > 12) parsedValue = '12'
    }

    // Ensure year only accepts four digits max
    if (name === 'year') {
      parsedValue = value.slice(0, 4)
    }

    // Focus logic
    if (name === 'day' && value.length === 2) {
      monthInputRef.current.focus() // Focus month input when day is complete
    } else if (name === 'month' && value.length === 2) {
      yearInputRef.current.focus() // Focus year input when month is complete
    }

    setFormData((prevState) => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : parsedValue,
    }))
  }

  const onSubmit = (e) => {
    e.preventDefault()
    // make sure tier is selcted (prem / free)
    if (tier === '' || tier === 'choose') {
      setErrorMsg('You must select a tier.')
      setShowError(true)
      setTimeout(() => {
        setShowError(false)
        setErrorMsg('')
      }, 2500)
      return
    }

    const welcomeData = {
      email,
      username: name,
      tier,
      invoiceNumber: `${crypto.randomUUID().slice(0, 7)}`,
      loginDetails: {
        email,
        password: password,
      },
      purchases: [
        {
          id: crypto.randomUUID(),
          product: '1 month subscription',
          quantity: 1,
          price: 100,
          total: 100,
        },
        {
          id: crypto.randomUUID(),
          product: 'blogger plus',
          quantity: 1,
          price: 300,
          total: 300,
        },
      ],
    }

    const userData = {
      name,
      email,
      password,
      password2,
      dob: formatedDOB(day, month, year),
      terms,
      emailList,
      day,
      month,
      year,
      tier,
    }

    dispatch(register(userData))
      .unwrap()
      .then((user) => {
        toast.success(`Registered new user: ${user.name}`)
        dispatch(sendWelcomeEmails(welcomeData))
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

    if (emailList === true) {
      const emailData = {
        date: getDate().date,
        time: getDate().time,
        name: `${name}`,
        email,
        terms,
      }

      dispatch(emailSignUp({ data: emailData, from: 'regPage' }))
    }
  }

  const handleShowPassword = (index) => {
    if (index === 1) {
      setPasswordType1(passwordType1 === 'password' ? 'text' : 'password')
      setPasswordClass1(passwordType1 === 'password' ? eyeOn : eyeOff)
    } else {
      setPasswordType2(passwordType2 === 'password' ? 'text' : 'password')
      setPasswordClass2(passwordType2 === 'password' ? eyeOn : eyeOff)
    }
  }

  const handleSelectChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      tier: e.target.value,
    }))
  }

  return (
    <>
      <div className="register-page-container">
        <section className="register-heading">
          <h1 className="register-h1">
            <p>
              <i className="fa-solid fa-right-to-bracket register-arrow"></i> register
              here
            </p>
            <p>
              for your <span className="free-span">free</span> account
            </p>
          </h1>
        </section>

        <section className="register-form-section">
          <div className="holding-box register-form-holding-box">
            <form onSubmit={onSubmit} className="register-form">
              <div className="form-group">
                {showError && <div className="alert-login">{errorMsg}</div>}
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={onChange}
                  className="form-input register-input"
                  name="name"
                  placeholder="Enter Name"
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  id="email"
                  value={email}
                  onChange={onChange}
                  className="form-input register-input"
                  name="email"
                  placeholder="Enter Email"
                />
              </div>
              <div className="form-group register-password-wrap">
                <input
                  type={passwordType1}
                  id="password"
                  value={password}
                  onChange={onChange}
                  className="form-input register-input"
                  name="password"
                  placeholder="Enter Password"
                  autoComplete="on"
                />
                <i
                  onClick={() => handleShowPassword(1)}
                  className={`view-password ${passwordClass1}`}
                ></i>
              </div>
              <div className="form-group register-password-wrap">
                <input
                  type={passwordType2}
                  id="password2"
                  value={password2}
                  onChange={onChange}
                  className="form-input register-input"
                  name="password2"
                  placeholder="Confirm password"
                  autoComplete="on"
                />
                <i
                  onClick={() => handleShowPassword(2)}
                  className={`view-password ${passwordClass2}`}
                ></i>
              </div>

              <div className="form-group register-dob-wrap">
                <div className="register-dob-container">
                  <label className="dob-label" htmlFor="">
                    date of birth
                  </label>
                  <input
                    onChange={onChange}
                    name="day"
                    type="text"
                    className="dob-input"
                    placeholder="dd"
                    value={day.slice(0, 2)}
                    maxLength="2"
                  />
                  <input
                    ref={monthInputRef} // Use ref to focus on month
                    onChange={onChange}
                    name="month"
                    type="text"
                    className="dob-input"
                    placeholder="mm"
                    value={month.slice(0, 2)}
                    maxLength="2"
                  />
                  <input
                    ref={yearInputRef} // Use ref to focus on year
                    onChange={onChange}
                    name="year"
                    type="text"
                    className="dob-input"
                    placeholder="yy yy"
                    value={year.slice(0, 4)}
                    maxLength="4"
                  />
                </div>
              </div>

              <div className="form-group register-dob-wrap">
                <label htmlFor="reg-terms-check" className="reg-check-label">
                  <input
                    onChange={onChange}
                    className="reg-terms-check"
                    type="checkbox"
                    name="terms"
                    checked={terms}
                    id="reg-terms-check"
                    value={terms}
                  />
                  <span className="reg-email-span">accept terms</span>
                </label>
                <label htmlFor="reg-email-check" className="reg-check-label">
                  <input
                    onChange={onChange}
                    className="reg-email-check"
                    type="checkbox"
                    name="emailList"
                    checked={emailList}
                    id="reg-email-check"
                    value={emailList}
                  />
                  <span className="reg-email-span">join our mailing list</span>
                </label>
              </div>

              <div className="form-group tier-group">
                <select onChange={handleSelectChange} className="register-tier-select">
                  <option value="choose">choose subscription tier</option>
                  <option value="free">free</option>
                  <option value="prem">premium</option>
                </select>
                <i className="fa-solid fa-chevron-down tier-chev"></i>
              </div>
              <div className="form-group form-btn-container">
                <button className="form-btn register-btn">register me</button>
              </div>
            </form>
          </div>

          <div className="holding-box"></div>
        </section>
      </div>
    </>
  )
}

export default Register
