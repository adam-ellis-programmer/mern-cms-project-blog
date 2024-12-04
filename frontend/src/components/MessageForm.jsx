import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getDate } from '../utils'
import { createMsg } from '../features/messages/msgSlice'
import { emailSignUp } from '../features/users/userSlice'

function MessageForm() {
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    msg: '',
    about: '', // blogging, billing, support, membership (options)
    contactPhone: false,
    contactEmail: false,
    terms: false,
    mailingList: false,
  })

  const onChange = (e) => {
    const { name, type, checked, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const {
    firstName,
    lastName,
    email,
    phone,
    msg,
    about,
    contactPhone,
    contactEmail,
    terms,
    mailingList,
  } = formData

  const onSubmit = (e) => {
    e.preventDefault()
    const data = {
      firstName,
      lastName,
      email,
      phone,
      msg,
      about,
      contactPhone,
      contactEmail,
      terms,
      mailingList,
      date: getDate().date,
      time: getDate().time,
      fullName: `${firstName} ${lastName}`,
    }

    dispatch(createMsg(data))
      .unwrap()
      .then((data) => {
        resetFormData()
        console.log(data)
      })
      .catch((err) => console.log(err))

    if (mailingList === true && terms === true) {
      const emailData = {
        date: getDate().date,
        time: getDate().time,
        name: `${firstName} ${lastName}`,
        email,
        terms,
      }

      dispatch(emailSignUp({ data: emailData, from: 'msgPage' }))
    }
  }

  const resetFormData = () => {
    // radio buttons have to have the checked Attribute
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      msg: '',
      about: '', // Resetting radio buttons -> now has the checked value
      contactPhone: false,
      contactEmail: false,
      terms: false,
      mailingList: false,
    })
  }

  return (
    <form onSubmit={onSubmit} className="message-form">
      <div className="message-form-group message-name-container">
        <input
          name="firstName"
          onChange={onChange}
          className="message-input message-name"
          type="text"
          placeholder="First Name"
          value={firstName}
        />
        <input
          name="lastName"
          onChange={onChange}
          className="message-input message-name"
          type="text"
          placeholder="Last Name"
          value={lastName}
        />
      </div>
      <div className="message-form-group">
        <input
          name="email"
          onChange={onChange}
          className="message-input"
          type="text"
          placeholder="Email"
          value={email}
        />
      </div>
      <div className="message-form-group">
        <input
          name="phone"
          onChange={onChange}
          className="message-input"
          type="text"
          placeholder="Phone"
          value={phone}
        />
      </div>
      <div className="message-form-group">
        <textarea
          name="msg"
          onChange={onChange}
          className="message-textarea"
          placeholder="enter message"
          value={msg}
        ></textarea>
      </div>

      <p className="message-info-p">
        <span>relating to</span>
      </p>
      <div className="type-wrap">
        <div className="message-form-group">
          <label className="message-label" htmlFor="blogging">
            <input
              onChange={onChange}
              type="radio"
              name="about"
              id="blogging"
              value="blogging"
              checked={about === 'blogging'}
            />
            <span>blogging</span>
          </label>
        </div>
        <div className="message-form-group">
          <label className="message-label" htmlFor="support">
            <input
              onChange={onChange}
              type="radio"
              name="about"
              id="support"
              value="support"
              checked={about === 'support'}
            />
            <span>support</span>
          </label>
        </div>

        <div className="message-form-group">
          <label className="message-label" htmlFor="membership">
            <input
              onChange={onChange}
              type="radio"
              name="about"
              id="membership"
              value="membership"
              checked={about === 'membership'}
            />
            <span>membership</span>
          </label>
        </div>

        <div className="message-form-group">
          <label className="message-label" htmlFor="billing">
            <input
              onChange={onChange}
              type="radio"
              name="about"
              id="billing"
              value="billing"
              checked={about === 'billing'}
            />
            <span>billing</span>
          </label>
        </div>
      </div>

      <p className="message-info-p">
        <span>contact by</span>
      </p>
      <div className="type-wrap">
        <label className="message-label" htmlFor="contactPhone">
          <input
            onChange={onChange}
            type="checkbox"
            name="contactPhone"
            id="contactPhone"
            checked={contactPhone}
          />
          <span>phone</span>
        </label>
      </div>

      <div className="type-wrap">
        <label className="message-label" htmlFor="contactEmail">
          <input
            onChange={onChange}
            type="checkbox"
            name="contactEmail"
            id="contactEmail"
            checked={contactEmail}
          />
          <span>email</span>
        </label>
      </div>
      <p className="message-info-p">
        <span>mailing list</span>
      </p>
      <div className="message-terms-wrap">
        <label className="message-label message-terms-label" htmlFor="mailingList">
          <input
            onChange={onChange}
            type="checkbox"
            name="mailingList"
            id="mailingList"
            checked={mailingList}
          />
          <span>join our mailing list</span>
        </label>
        <label className="message-label message-terms-label" htmlFor="terms">
          <input
            onChange={onChange}
            type="checkbox"
            name="terms"
            id="terms"
            checked={terms}
          />
          <span>accept terms</span>
        </label>
      </div>
      <div className="message-form-group submit-message-btn-wrap">
        <button className="submit-message-btn">send</button>
      </div>
    </form>
  )
}

export default MessageForm
