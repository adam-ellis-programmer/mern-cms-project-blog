import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { getEmailsSentAdmin, setEmailSentlData } from '../features/admin/adminSlice'
import BackButton from '../components/BackButton'
import NotAuthorized from '../components/NotAuthorized'
import MobileBackBTN from '../components/MobileBackBTN'
import SearchBar from '../components/search components/SearchBar'
import GlobalPageLoader from '../components/loaders/GlobalPageLoader'
import AdminEmailModal from '../components/email/AdminEmailModal'
import EmailSentItem from '../components/EmailSentItem'
import { scrollTop } from '../utils'

const ViewSentEmailsPage = () => {
  const { errMSG, isRejected, emailData, showEmailModal, sentEmailData } = useSelector(
    (state) => state.admin
  )

  const dispatch = useDispatch()

  useEffect(() => {
    scrollTop()

    return () => {}
  }, [])

  useEffect(() => {
    const getData = async () => {
      try {
        // set email data to display
        const data = await dispatch(getEmailsSentAdmin()).unwrap()
        dispatch(setEmailSentlData(data))
      } catch (error) {
        console.log(error)
      }
    }
    getData()
  }, [])

  // message sent back from the server
  if (errMSG !== null) {
    return <NotAuthorized errMSG={errMSG} />
  }

  const displayEmailHeader = () => {
    if (emailData && emailData.length === 0) {
      return `no emails to show`
    }
    if (emailData && emailData.length === 1) {
      return `${emailData && emailData.length} email`
    }
    if (emailData && emailData.length > 1) {
      return `${emailData && emailData.length} emails`
    }
  }

  if (!sentEmailData) {
    return <GlobalPageLoader />
  }
  return (
    <>
      {showEmailModal && <AdminEmailModal />}
      <div className="page-container email-page-container">
        <div className="view-emails-back-btn-wrap">
          <BackButton />
        </div>
        <div className="view-emails-mobile-back-btn-wrap">
          <MobileBackBTN />
        </div>

        <section className="email-signup-header">
          <h1>
            view and manage all your email signups
            <p>in one place</p>
          </h1>
          <p>{displayEmailHeader()}</p>
        </section>

        <section className="serach-emails-section">
          <SearchBar data={emailData && emailData} />
        </section>

        <section className="email-signup-list-section">
          <div className="email-list-header">
            <div className="email-item-inner-div">item</div>
            <div className="email-item-inner-div">to</div>
            <div className="email-item-inner-div">from</div>
            <div className="email-item-inner-div">subject</div>
            <div className="email-item-inner-div">read</div>
          </div>

          {sentEmailData &&
            sentEmailData.length > 0 &&
            sentEmailData.map((item, index) => (
              <EmailSentItem key={item._id} data={item} index={index} />
            ))}
        </section>
      </div>
    </>
  )
}

export default ViewSentEmailsPage
