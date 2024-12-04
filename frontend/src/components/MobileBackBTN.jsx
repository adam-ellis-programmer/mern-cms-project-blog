import { useNavigate } from 'react-router-dom'

function MobileBackBTN() {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate(-1)
  }
  return (
    <div className="mobile-back-btn-container">
      <button onClick={handleBack} className="mobile-back-btn">
        <i className=" mobile-back-icon fa-solid fa-arrow-left-long"></i>
      </button>
    </div>
  )
}

export default MobileBackBTN
