function AccountAlert({ alertMSG, alertType }) {
  function getClassName(params) {
    switch (alertType) {
      case 'success':
        return 'account-success'

      case 'error':
        return 'account-error'

      default:
        return 'account-error'
    }
  }
  console.log(alertType)
  return (
    <div className={`account-alert-div ${getClassName()} `}>
      <h4>{alertMSG}</h4>
    </div>
  )
}

export default AccountAlert
