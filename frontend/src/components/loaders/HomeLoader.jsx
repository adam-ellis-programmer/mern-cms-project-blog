import load from '../loaders/load-4.gif'

function HomeLoader() {
  return (
    <div className="home-loader-div">
      <p>we are fetching your blogs...</p>
      <img src={load} alt="" />
    </div>
  )
}

export default HomeLoader
