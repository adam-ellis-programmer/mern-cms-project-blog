import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux' // Import combineReducers
import authReducer from '../features/auth/authSlice'
import blogReducer from '../features/blog/blogSlice'
import taskReducer from '../features/tasks/taskSlice'
import adminReducer from '../features/admin/adminSlice'
import userReducer from '../features/users/userSlice'
import msgReducer from '../features/messages/msgSlice'

// Combine all reducers
const appReducer = combineReducers({
  auth: authReducer,
  blogs: blogReducer,
  tasks: taskReducer,
  admin: adminReducer,
  user: userReducer,
  msg: msgReducer,
})

// Create a root reducer
const rootReducer = (state, action) => {
  if (action.type === 'auth/logout') {
    // Clear all state
    state = undefined
  }
  return appReducer(state, action)
}

// Configure the store with the root reducer
export const store = configureStore({
  reducer: rootReducer,
})

// *** KEEP FOR NOTES *** //
// for preserved state such as UI experience etc
// const rootReducer = (state, action) => {
//   if (action.type === 'auth/logout') {
//     const { somePersistentReducer } = state
//     state = { somePersistentReducer }
//   }
//   return appReducer(state, action)
// }
