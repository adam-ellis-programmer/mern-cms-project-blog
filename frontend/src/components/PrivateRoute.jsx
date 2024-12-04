import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

const PrivateRoute = () => {
  const { user } = useSelector((state) => state.auth)

  // If the user is logged in, render the child routes
  if (user) return <Outlet />

  // If not logged in, redirect to sign-in page
  return <Navigate to="/sign-in" />
}

export default PrivateRoute
