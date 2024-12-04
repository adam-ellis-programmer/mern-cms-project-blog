import EmailItem from '../components/EmailItem'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { getEmailListAdmin, setEmailData } from '../features/admin/adminSlice'
import BackButton from '../components/BackButton'
import NotAuthorized from '../components/NotAuthorized'
import MobileBackBTN from '../components/MobileBackBTN'
import SearchBar from '../components/search components/SearchBar'
import GlobalPageLoader from '../components/loaders/GlobalPageLoader'
import AdminEmailModal from '../components/email/AdminEmailModal'
import { setShowEmailModal } from '../features/admin/adminSlice'
import { scrollTop } from '../utils'

function EmailSignUpsPage() {
  const { errMSG, isRejected, emailData, showEmailModal } = useSelector(
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
        const data = await dispatch(getEmailListAdmin()).unwrap()
        dispatch(setEmailData(data))
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

  // dynamicly display email header dependent on if emails or not
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

  if (!emailData) {
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
            <div className="email-item-inner-div">name</div>
            <div className="email-item-inner-div">email</div>
            <div className="email-item-inner-div">date</div>
            <div className="email-item-inner-div">time</div>
            <div className="email-item-inner-div">email</div>
          </div>

          {emailData &&
            emailData.length > 0 &&
            emailData.map((item, index) => (
              <EmailItem key={item._id} data={item} index={index} />
            ))}
        </section>
      </div>
    </>
  )
}

export default EmailSignUpsPage
