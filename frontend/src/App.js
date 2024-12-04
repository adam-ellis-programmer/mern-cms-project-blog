import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Home from './pages/Home'
import Register2 from './pages/Register2'
import SignIn2 from './pages/SignIn2'
import Header from './layout/Header'
import Footer from './layout/Footer'
import PrivateRoute from './components/PrivateRoute'
import NewBlog from './pages/NewBlog'
import UserBlogs from './pages/UserBlogs'
import UserBlogPage from './pages/UserBlogPage'
import Tasks from './pages/Tasks'
import ManageImages from './pages/ManageImages'
import MyAccount from './pages/MyAccount'
import PublicBlogPage from './pages/PublicBlogPage'
import AdminDash from './pages/AdminDash'
import AdminUsers from './pages/AdminUsers'
import Admin from './pages/AdminBlogs'
import ViewEmails from './pages/ViewEmails'
import ViewSentEmailsPage from './pages/ViewSentEmailsPage'
import ViewSentEmailDataPage from './pages/ViewSentEmailDataPage'
import CreateBlogAdmin from './pages/CreateBlogAdmin'
import FAQS from './pages/FAQS'
import Ask from './pages/Ask'
import MessagesPage from './pages/MessagesPage'
import Terms from './pages/Terms'
import NotFound from './pages/NotFound'

function App() {
  return (
    <>
      <Router>
        <div className="container">
          <Header />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register2 />} />
            <Route path="/sign-in" element={<SignIn2 />} />
            <Route path="/faqs" element={<FAQS />} />
            <Route path="/ask" element={<Ask />} />
            <Route path="/terms" element={<Terms />} />

            {/* Private Routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/new-blog" element={<NewBlog />} />
              <Route path="/user-blogs" element={<UserBlogs />} />
              <Route path="/user-blog/:blogID" element={<UserBlogPage />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/manage-images/:blogID" element={<ManageImages />} />
              <Route path="/my-account" element={<MyAccount />} />
              <Route path="/public-blog/:blogID" element={<PublicBlogPage />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin-dash" element={<AdminDash />} />
            <Route path="/admin-blogs" element={<Admin />} />
            <Route path="/admin-users" element={<AdminUsers />} />
            <Route path="/email-page" element={<ViewEmails />} />
            <Route path="/view-sent-emails" element={<ViewSentEmailsPage />} />
            <Route
              path="/view-sent-email-data-page/:id"
              element={<ViewSentEmailDataPage />}
            />
            <Route path="/admin-new-blog" element={<CreateBlogAdmin />} />

            {/* Catch-All Route */}
            <Route path="/*" element={<NotFound />} />
          </Routes>
          <Footer />
        </div>
      </Router>
      <ToastContainer />
    </>
  )
}

export default App
