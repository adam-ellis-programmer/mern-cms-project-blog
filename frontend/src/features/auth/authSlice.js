import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit'
// { } threw an error as a default
import authService from './authService'

import { extractErrorMessage } from '../../utils'

let user = JSON.parse(localStorage.getItem('user'))

const initialState = {
  user: user ? user : null,
  isLoading: false,
  message: '',
  showAlert: false,
  isError: false,
}

export const register = createAsyncThunk('auth/register', async (user, thunkAPI) => {
  try {
    console.log(user)
    return await authService.register(user)
  } catch (error) {
    return thunkAPI.rejectWithValue(extractErrorMessage(error))
  }
})
export const registerAsAdnin = createAsyncThunk(
  'auth/register/admin/new',
  async (user, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await authService.registerAsAdnin(token, user)
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error))
    }
  }
)

export const login = createAsyncThunk('auth/login', async (user, thunkAPI) => {
  try {
    return await authService.login(user)
  } catch (error) {
    return thunkAPI.rejectWithValue(extractErrorMessage(error))
  }
})
export const sendWelcomeEmails = createAsyncThunk(
  'send/welcome/emails',
  async (data, thunkAPI) => {
    try {
      return await authService.sendWelcomeEmails(data)
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error))
    }
  }
)

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      //<-- reset initial state
      state.isLoading = false
      state.message = ''
    },
    updateUSerState: (state, action) => {
      //<-- reset initial state
      state.user = action.payload
    },

    logout: (state) => {
      authService.logout()
      state.user = null
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload
        state.isLoading = false
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false
        state.message = action.payload
        // state.user = null // <-- delete
      })

      .addCase(login.pending, (state) => {
        state.isLoading = true
      })
      .addCase(login.fulfilled, (state, action) => {
        // console.log(action)
        state.isLoading = false
        state.user = action.payload
      })
      .addCase(login.rejected, (state) => {
        state.isLoading = false
      })

      .addCase(registerAsAdnin.pending, (state) => {
        state.showAlert = true
        state.isError = false
      })
      .addCase(registerAsAdnin.fulfilled, (state) => {
        state.showAlert = false
        state.isError = false
      })
      .addCase(registerAsAdnin.rejected, (state) => {
        state.showAlert = true
        state.isError = true
      })
  },
})

export const { reset, setShowAlert, updateUSerState, logout } = authSlice.actions //<-- regular reducers

export default authSlice.reducer
