import load from '../loaders/load-3.gif'

function GlobalPageLoader({ isDeleting }) {
  return (
    <div className="loader-div">
      {isDeleting ? (
        <h4 className="loader-text">we are deleting your data</h4>
      ) : (
        <h4 className="loader-text">we are fetching your data</h4>
      )}
      <img className="loader-gif" src={load} alt="" />
    </div>
  )
}

export default GlobalPageLoader
