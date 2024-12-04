import { useState, useEffect } from 'react'
import { getDate } from '../utils'
import { useDispatch, useSelecor } from 'react-redux'
import { emailSignUp } from '../features/users/userSlice'

function EmailSignUpForm() {
  const [showError, setShowError] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')
  const [isSuccess, setIsSuccess] = useState(true)
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    terms: false,
  })
  const { name, email, terms } = formData

  const onMutate = (e) => {
    const { id, type, checked } = e.target

    setFormData((prevState) => ({
      ...prevState,
      [id]: type === 'checkbox' ? checked : e.target.value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const newData = {
      ...formData,
      date: getDate().date,
      time: getDate().time,
    }

    // put state in one funciton an call it
    dispatch(emailSignUp({ data: newData, from: 'home' }))
      .unwrap()
      .then((data) => {
        handleAlert(data)
      })
      .catch((err) => {
        handleAlert(null, err)
      })

    // console.log(newData)
  }

  const resetFormData = () => {
    setFormData((prevState) => ({
      ...prevState,
      name: '',
      email: '',
      terms: false,
    }))
  }

  const getAlertClass = () => {
    return `signup-alert ${isSuccess ? 'isSuccessEmail' : 'isErrorEmail'} `
  }

  const handleAlert = (data, err) => {
    // if data do this
    if (data) {
      setShowError(true)
      setErrorMsg(data.name + ' signed up')
      setIsSuccess(true)
      resetFormData()
      // reset
      setTimeout(() => {
        setShowError(false)
        setErrorMsg('')
        setIsSuccess(null)
      }, 2000)
    }
    // if error do this
    if (err) {
      setShowError(true)
      setIsSuccess(false)
      setErrorMsg(err)
      setTimeout(() => {
        setShowError(false)
        setErrorMsg('')
        setIsSuccess(null)
      }, 2000)
      // console.log(err)
    }
  }
  return (
    <form onSubmit={handleSubmit} className="signup-form">
      {showError && <div className={getAlertClass()}>{errorMsg} </div>}
      <h2>
        <span>join our mailing list</span>
      </h2>
      <div className="home-form-control">
        <input
          onChange={onMutate}
          id="name"
          className="home-input"
          type="text"
          value={name}
          placeholder="enter name"
        />
      </div>

      <div className="home-form-control">
        <input
          onChange={onMutate}
          className="home-input"
          type="text"
          id="email"
          value={email}
          placeholder="enter email"
        />
      </div>

      <div className="home-form-control">
        <label className="terms-label" htmlFor="terms">
          <input
            onChange={onMutate}
            id="terms"
            className="sign-up-checkbox"
            type="checkbox"
            value={terms}
            // placeholder="enter email"
            checked={terms}
          />
          <span>accept terms </span>
        </label>
      </div>

      <div className="home-form-control signup-btn-form-control">
        <button className="signup-btn">sign up</button>
      </div>
    </form>
  )
}

export default EmailSignUpForm
