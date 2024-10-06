import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import type {MessageMetadata} from './types';

type MessagesState = {
  messages: MessageMetadata[],
  nextPageToken: string,
  status: 'idle' | 'loading' | 'failed'
};

const initialState: MessagesState = {
  messages: [],
  nextPageToken: '',
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
    setNextPageToken: (state, action: PayloadAction<string>) => {
      state.nextPageToken = action.payload;
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
})

export const {
  pushMessage,
  upsertMessage,
  setNextPageToken,
  setMessagesLoading,
  loadMessagesSuccess,
  loadMessagesFailure,
  resetMessages
} = messagesSlice.actions;

export default messagesSlice.reducer;
