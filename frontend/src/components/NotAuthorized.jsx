import logo from '../img/logo.png'
import BackButton from '../components/BackButton'
function NotAuthorized({ errMSG }) {
  return (
    <div className="error-page page-container">
      <BackButton />
      <div className="error-page-inner-div">
        <i className="lock-icon fa-solid fa-user-lock"></i>
        <img className="err-page-logo" src={logo} alt="" />
        <p className="error-p">{errMSG}</p>
      </div>
    </div>
  )
}

export default NotAuthorized
