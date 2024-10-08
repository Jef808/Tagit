import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import type {MessageMetadata} from './types';

type MessagesState = {
  messages: MessageMetadata[],
  pageToken: string,
  status: 'idle' | 'loading' | 'failed'
};

const initialState: MessagesState = {
  messages: [],
  pageToken: '',
  status: 'idle'
};

export const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    pushMessage: (state, action: PayloadAction<MessageMetadata>) => {
        state.messages.push(action.payload);
    },
    upsertMessage: (state, action: PayloadAction<MessageMetadata>) => {
      const index = state.messages.findIndex(({id}) => id == action.payload.id);
      if (index === -1) {
        state.messages.push(action.payload);
      } else {
        state.messages[index] = action.payload;
      }
    },
    setPageToken: (state, action: PayloadAction<string>) => {
      state.pageToken = action.payload;
    },
    setMessagesLoading: (state) => {
      state.status = 'loading';
    },
    loadMessagesSuccess: (state) => {
      state.status = 'idle';
    },
    loadMessagesFailure: (state) => {
      state.status = 'failed';
    },
    resetMessages: () => initialState
  }
});

export const {
  pushMessage,
  upsertMessage,
  setPageToken,
  setMessagesLoading,
  loadMessagesSuccess,
  loadMessagesFailure,
  resetMessages
} = messagesSlice.actions;

export default messagesSlice.reducer;
