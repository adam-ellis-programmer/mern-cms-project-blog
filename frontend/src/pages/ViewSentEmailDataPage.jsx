import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getSingleEmail } from '../features/admin/adminSlice'
import { useDispatch } from 'react-redux'
import { scrollTop } from '../utils'

const ViewSentEmailDataPage = () => {
  const [emailData, setEmailData] = useState(null)
  const { id } = useParams()
  const dispatch = useDispatch()

  useEffect(() => {
    scrollTop()
    const getData = async () => {
      const data = await dispatch(getSingleEmail(id)).unwrap()
      setEmailData(data)
      console.log(data)
    }

    getData()
    return () => {}
  }, [id])

  return (
    <div className="page-container email-page-container">
      <section className="email-data-header"></section>

      <section className="email-page-info-section">
        <div className="email-info-top-div">
          <div className="email-page-info-div">
            <span className="email-info-first-span">TO:</span>
            <span className="email-info-second-span">{emailData?.to}</span>
          </div>
          <div className="email-page-info-div">
            <span className="email-info-first-span">FROM:</span>
            <span className="email-info-second-span"> {emailData?.from}</span>
          </div>
        </div>
        <div className="email-page-info-div">
          <span className="email-info-first-span">SUBJECT:</span>
          <span className="email-info-second-span"> {emailData?.subject}</span>
        </div>
        <div className="email-page-info-div">
          <span className="email-info-first-span">READ:</span>
          <span className="email-info-second-span">
            {' '}
            {emailData?.read ? 'read' : 'not read'}
          </span>
        </div>
      </section>

      <section className="email-data-section">
        {emailData?.body && (
          <div
            dangerouslySetInnerHTML={{ __html: emailData.body }} // Render HTML content
          />
        )}
        {/* for testing */}
        {/* &lt;p&gt; */}
        {/* &lt;br&gt; */}
      </section>
    </div>
  )
}

export default ViewSentEmailDataPage
