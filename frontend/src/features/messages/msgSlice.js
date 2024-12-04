import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { extractErrorMessage } from '../../utils'
import msgService from '../messages/msgService'

const initialState = {
  messageID: '',
  showMsgAlert: false,
  msgAlertlMSG: '',
  isErr: false,
  isSuccess: false,
}

export const createMsg = createAsyncThunk('user/msg/new', async (data, thunkAPI) => {
  try {
    return await msgService.createMsg(data)
  } catch (error) {
    console.log(error)
    return thunkAPI.rejectWithValue(extractErrorMessage(error))
  }
})

export const getAllMsgsAdmin = createAsyncThunk('user/msg/new', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token
    return await msgService.getAllMsgsAdmin(token)
  } catch (error) {
    console.log(error)
    return thunkAPI.rejectWithValue(extractErrorMessage(error))
  }
})

export const deleteMsgAdmin = createAsyncThunk(
  'user/msg/delete',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await msgService.deleteMsgAdmin(token, id)
    } catch (error) {
      console.log(error)
      return thunkAPI.rejectWithValue(extractErrorMessage(error))
    }
  }
)

export const msgSlice = createSlice({
  name: 'msg',
  initialState,
  reducers: {
    setMessageID: (state, action) => {
      state.messageID = action.payload
    },
    setShowMsgAlert: (state, action) => {
      state.showMsgAlert = action.payload
    },
    setMsgAlertlMSG: (state, action) => {
      state.msgAlertlMSG = action.payload
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(createMsg.rejected, (state, action) => {
        state.showMsgAlert = true
        state.msgAlertlMSG = action.payload
      })

      .addCase(createMsg.fulfilled, (state, action) => {
        console.log(action.payload.msg)
        state.showMsgAlert = true
        state.msgAlertlMSG = action.payload.msg
      })
  },
})

export const { setMessageID, setShowMsgAlert, setMsgAlertlMSG } = msgSlice.actions
export default msgSlice.reducer
