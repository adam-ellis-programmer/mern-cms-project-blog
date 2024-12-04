import { useNavigate } from 'react-router-dom'

function BackButton() {
  const navigate = useNavigate()

  const handleBack = () => {
    // go back one -(1)
    navigate(-1)
  }
  return (
    <button className="back-btn" onClick={handleBack}>
      <i className="back fa-regular fa-hand-point-left"></i> <span>back</span>
    </button>
  )
}

export default BackButton
