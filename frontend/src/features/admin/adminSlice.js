import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit'

import adminService from './adminService'

import { extractErrorMessage } from '../../utils'

const initialState = {
  users: null,
  isLoading: false,
  isError: false,
  userID: '',
  isRejected: false,
  errMSG: null,
  emailData: null,

  sentEmailData: null,
  deleteUserInfo: {},
  showDeleteUserModal: false,
  showEmailModal: false,
  adminEmailUserID: '',
}

export const getAllUsersAdmin = createAsyncThunk('admin/get/all', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token
    return await adminService.getAllUsersAdmin(token)
  } catch (error) {
    console.log(error)
    return thunkAPI.rejectWithValue(extractErrorMessage(error))
  }
})
export const getUserAdmin = createAsyncThunk('admin/get/one', async (id, thunkAPI) => {
  // console.log(id)
  try {
    const token = thunkAPI.getState().auth.user.token
    return await adminService.getUserAdmin(id, token)
  } catch (error) {
    console.log(error)
    return thunkAPI.rejectWithValue(extractErrorMessage(error))
  }
})
export const updateUserAdmin = createAsyncThunk(
  'admin/put/one',
  async (idAndData, thunkAPI) => {
    const { id, data } = idAndData
    try {
      const token = thunkAPI.getState().auth.user.token
      return await adminService.updateUserAdmin(id, data, token)
    } catch (error) {
      console.log(error)
      return thunkAPI.rejectWithValue(extractErrorMessage(error))
    }
  }
)
export const deleteUserAdmin = createAsyncThunk(
  'admin/delete/one',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await adminService.deleteUserAdmin(id, token)
    } catch (error) {
      console.log(error)
      return thunkAPI.rejectWithValue(extractErrorMessage(error))
    }
  }
)

//  *************  EMAILS **************** //

export const getEmailListAdmin = createAsyncThunk(
  'admin/get/allEmails',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await adminService.getEmailListAdmin(token)
    } catch (error) {
      console.log(error)
      return thunkAPI.rejectWithValue(extractErrorMessage(error))
    }
  }
)
// get sent email data
export const getEmailsSentAdmin = createAsyncThunk(
  'admin/get/all/sent',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await adminService.getEmailsSentAdmin(token)
    } catch (error) {
      console.log(error)
      return thunkAPI.rejectWithValue(extractErrorMessage(error))
    }
  }
)

export const getSingleEmail = createAsyncThunk(
  'admin/get/all/sent/one',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await adminService.getSingleEmail(token, id)
    } catch (error) {
      console.log(error)
      return thunkAPI.rejectWithValue(extractErrorMessage(error))
    }
  }
)

export const getUserForEmailAdmin = createAsyncThunk(
  'admin/get/user/email',
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await adminService.getUserForEmailAdmin(token, data)
    } catch (error) {
      console.log(error)
      return thunkAPI.rejectWithValue(extractErrorMessage(error))
    }
  }
)

export const sendEmail = createAsyncThunk('admin/send/email', async (data, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token
    return await adminService.sendEmail(token, data)
  } catch (error) {
    console.log(error)
    return thunkAPI.rejectWithValue(extractErrorMessage(error))
  }
})

export const adminSlice = createSlice({
  name: 'admin',
  initialState,
  toggleUpdateModal: false,
  reducers: {
    setToggleUpdateModal: (state, action) => {
      state.toggleUpdateModal = action.payload
    },
    setUserID: (state, action) => {
      state.userID = action.payload
    },
    setUsers: (state, action) => {
      state.users = action.payload
    },
    // sperad for Redux State Immutability: (see object freeze)
    setEmailData: (state, action) => {
      state.emailData = [...action.payload]
    },
    setEmailSentlData: (state, action) => {
      state.sentEmailData = [...action.payload]
    },
    setUserData: (state, action) => {
      state.users = [...action.payload]
    },
    setUserToDelete: (state, action) => {
      state.deleteUserInfo = action.payload
    },
    setToggleDeleteUserModal: (state, action) => {
      state.showDeleteUserModal = action.payload
    },
    setShowEmailModal: (state, action) => {
      // console.log(action.payload)
      state.showEmailModal = action.payload.boolean
      state.adminEmailUserID = action.payload.id
    },

    // kept as a refrence
    // setEmailDataFiltered: (state, action) => {
    //   const filteredItems = [...action.payload]
    //   console.log(filteredItems)
    //   state.emailData = filteredItems
    // },
  },

  extraReducers: (builder) => {
    builder.addCase(getAllUsersAdmin.fulfilled, (state, action) => {
      state.users = action.payload
    })
    builder.addCase(getAllUsersAdmin.rejected, (state, action) => {
      state.errMSG = action.payload
      state.isRejected = true
    })
    builder.addCase(getEmailListAdmin.rejected, (state, action) => {
      console.log(action.payload)
      state.errMSG = action.payload
      state.isRejected = true
    })
  },
})

export const {
  setToggleUpdateModal,
  setUserID,
  setUsers,
  setEmailData,
  setEmailDataFiltered,
  setUserData,
  setUserToDelete,
  setToggleDeleteUserModal,
  setShowEmailModal,
  setEmailSentlData,
} = adminSlice.actions
export default adminSlice.reducer
