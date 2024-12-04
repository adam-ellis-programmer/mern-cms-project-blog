import { useSelector, useDispatch } from 'react-redux'
import { getAllUsersAdmin, setUserData } from '../../features/admin/adminSlice'

function UserSearchBar() {
  const dispatch = useDispatch()

  const handleRadioChange = async (e) => {
    const { id, type, checked } = e.target

    const users = await dispatch(getAllUsersAdmin()).unwrap()

    const filtered = users.filter((user) => {
      switch (id) {
        case 'all':
          return true
        case 'isSuspendedSearch':
          return user.isSuspended
        case 'isAdminSearch':
          return user.isAdmin
        case 'both':
          return user.isAdmin && user.isSuspended
        default:
          return true
        // return true loops through and rtns everyone
      }
    })

    dispatch(setUserData(filtered))
  }

  const handleTextSearch = async (e) => {
    e.preventDefault()
    const { value, id } = e.target
    const userInput = value.toLowerCase()
    const users = await dispatch(getAllUsersAdmin()).unwrap()

    const newArr = []
    users.forEach((item) => {
      const loopedName = item.name.toLowerCase()

      if (loopedName.indexOf(userInput) !== -1) {
        newArr.push(item)
      }
      dispatch(setUserData(newArr))
    })
  }

  return (
    <div className="user-search-div">
      {/* text search form  */}
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          onChange={handleTextSearch}
          type="text"
          id="nameSearch"
          className="user-search-input"
          placeholder="search user by name"
        />
      </form>
      {/* radio search form */}
      <form onSubmit={(e) => e.preventDefault()} className="user-filter-form">
        <div className="radio-wrap">
          <input
            onChange={handleRadioChange}
            type="radio"
            id="all"
            name="user"
            className="radio"
          />
          <label htmlFor="all">All</label>
        </div>
        <div className="radio-wrap">
          <input
            onChange={handleRadioChange}
            type="radio"
            id="isSuspendedSearch"
            name="user"
            className="radio"
          />
          <label htmlFor="isSuspendedSearch">suspended</label>
        </div>
        <div className="radio-wrap">
          <input
            onChange={handleRadioChange}
            type="radio"
            id="isAdminSearch"
            name="user"
            className="radio"
          />
          <label htmlFor="isAdminSearch">admin</label>
        </div>
        <div className="radio-wrap">
          <input
            onChange={handleRadioChange}
            type="radio"
            id="both"
            name="user"
            className="radio"
          />
          <label htmlFor="both">admin / susp</label>
        </div>
      </form>
    </div>
  )
}

export default UserSearchBar
