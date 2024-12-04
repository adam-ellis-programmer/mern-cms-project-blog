import { useState } from 'react'
import logo from '../img/logo-white.png'
import { getDate } from '../utils'

import { useDispatch, useSelecor } from 'react-redux'
import { emailSignUp } from '../features/users/userSlice'
import { Link } from 'react-router-dom'
//
// prettier-ignore
function Footer() {
  const [msg, setMsg] = useState('success');
  const [isSuccess, setIsSuccess] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [formData, setFormData] = useState({
    footerEmail: '',
    footerTerms: false,
  });
  const {footerEmail, footerTerms} = formData
  const dispatch = useDispatch()

  const date = getDate()
  // console.log(date.date)
  // const [date, setdate] =  useState();

  const handleSubmit = async (e)  =>{
      e.preventDefault()
      // console.log('clicked')

      const data = {
        ...formData,
        date: getDate().date,
        time: getDate().time,
        terms: footerTerms,
      }

        try {
          const res = await dispatch(emailSignUp({data, from: 'footer'}))
          // console.log(res)
          if(res.meta.rejectedWithValue){
            throw new Error(res.payload)
          }

          if(res.meta.requestStatus === 'fulfilled'){
            setMsg('you are now signed up!')
            setShowAlert(true)
            setIsSuccess(true)
  
            setTimeout(() => {
              setMsg('')
              setShowAlert(false)
            }, 2000);
            resetFormData()
          }

        } catch (error) {
          setIsSuccess(false)
          console.log(error.message)
          setMsg(error.message)
          setShowAlert(true)

          setTimeout(() => {
            setMsg('')
            setShowAlert(false)
          }, 2000);
        }

  }

  const resetFormData = () =>{
    setFormData((prevState) => ({
      ...prevState,
      footerEmail: '',
      footerTerms: false,
    }))
  }

  const handleEmail = (e) => {
    const { id, type, checked } = e.target
      setFormData((prevState) =>({
        ...prevState,
        [id]: type === 'checkbox' ? checked : e.target.value
      }))
  }

  const getClassName = () =>{
    return `footer-msg-div ${isSuccess? 'footer-succes' : 'footer-error'}`
  }

  return (
    <div className="footer">
      <div className="footer-left">
        <ul>
        <h3>info</h3>
          <li><Link to='/' className='footer-link'>About travel blogging site</Link></li>
          <li><Link to='/' className='footer-link'>Contact</Link></li>
          <li><Link to='faqs' className='footer-link'>FAQs</Link></li>
          <li><Link to='/' className='footer-link'>Glossary</Link></li>
          <li><Link to='/' className='footer-link'>Collaborations</Link></li>
          <li><Link to='/' className='footer-link'>Privacy Policy & Terms of Use</Link></li>
        </ul>
        <ul>
          <h3>getting started</h3>
          <li><Link to='/' className='footer-link'>Beginner's Guide</Link></li>
          <li><Link to='/' className='footer-link'>Must-Read Posts</Link></li>
          <li><Link to='/' className='footer-link'>Subscribe</Link></li>
          <li><Link to='/' className='footer-link'>Join Our Community</Link></li>
          <li><Link to='/' className='footer-link'>Sample Content/Templates</Link></li>
          <li><Link to='/ask' className='footer-link'>Ask Us Anything</Link></li>
        </ul>
        <ul>
          <h3>Resources</h3>
          <li><Link to='/' className='footer-link'>Recommended Tools</Link></li>
          <li><Link to='/' className='footer-link'>Books & Articles</Link></li>
          <li><Link to='/' className='footer-link'>External Websites</Link></li>
          <li><Link to='/' className='footer-link'>Industry Events</Link></li>
          <li><Link to='/' className='footer-link'>Podcasts/Videos</Link></li>
          <li><Link to='/' className='footer-link'>Case Studies/Success Stories</Link></li>
        </ul>
      </div>
      <div className='footer-middle' >
        <div className='footer-middle-inner'>
          <h3 className='footer-middle-h3' ><span className='footer-middle-span'>jump on our mailing list</span></h3>
         {showAlert &&  <div className={getClassName()}>{msg}</div>}

          <form onSubmit={handleSubmit} className='footer-form' >
            <input type="text" 
            onChange={handleEmail}
            className="footer-email-input" 
            value={footerEmail}
            placeholder='enter email' 
            id='footerEmail'
            />
            
            <label  className='terms-label' htmlFor="footerTerms">
              <input className='footer-terms-input' onChange={handleEmail} type="checkbox" name="" id="footerTerms"  value={footerTerms} checked={footerTerms}/>
              <span  className='terms-span' >accept terms</span>
            </label>
            <button className="footer-emial-btn">submit</button>
          </form>
        </div>
        <div className='footer-middle-inner footer-date-div' >
          <span>last visited at:</span>
          <p>{date.date}</p>
          <p>{date.time}</p>
          <p>© travel blogging site {new Date().getFullYear()}</p>
        </div>
      </div>
      <div className="footer-logo-div">
        <div className='footer-links-div' > 
          <Link  className='footer-right-link' to='/my-account' >
            my account 
          </Link>
          <Link className='footer-right-link' to='terms' >
            terms and conditions
          </Link>
        </div>
        <div className='footer-right-middle' >
          <Link to='/'>
        <img className="footer-logo" src={logo} alt="" />
          </Link>
        </div>
        <div className='social-icons-container' >
        <i className="social-icon fa-brands fa-facebook"></i>
        <i className="social-icon fa-brands fa-twitter"></i>
        <i className="social-icon fa-brands fa-instagram"></i>
        </div>
      </div>
    </div>
  )
}

export default Footer
