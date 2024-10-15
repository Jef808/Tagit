import {createAsyncThunk, createEntityAdapter, createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '../../store';

export type MessageGroup = {
  id: string;
  count: number;
};

const messageGroupsAdapter = createEntityAdapter<MessageGroup>({
  sortComparer: (a, b) => b.count - a.count
});

const initialState = messageGroupsAdapter.getInitialState({
  status: 'idle',
  nextPageToken: ''
} as {
  status: 'idle' | 'loading' | 'failed',
  nextPageToken: string
});

export const fetchMessageGroups = createAsyncThunk('messageGroups/fetchMessageGroups', async (pageToken: string = '') => {
  const {
    messageGroups: messageGroupsRes,
    nextPageToken
  } = await fetch(`http://localhost:3030/messageGroups/${pageToken}`).then(res => res.json());

  const messageGroups = Object.entries(messageGroupsRes).map(([fromHeader, count]) => ({
    id: fromHeader,
    count
  } as MessageGroup));

  return {
    messageGroups,
    nextPageToken
  };
});

const messageGroupsSlice = createSlice({
  name: 'messageGroups',
  initialState,
  reducers: {
    messageGroupRemoved: (state, action: PayloadAction<string>) => {
      messageGroupsAdapter.removeOne(state, action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchMessageGroups.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchMessageGroups.fulfilled, (state, action: PayloadAction<{messageGroups: MessageGroup[], nextPageToken: string}>) => {
        const {messageGroups, nextPageToken} = action.payload;
        messageGroupsAdapter.upsertMany(state, messageGroups);
        state.nextPageToken = nextPageToken;
        state.status = 'idle';
      })
      .addCase(fetchMessageGroups.rejected, (state) => {
        state.status = 'failed';
      });
  }
});

export const {
  messageGroupRemoved,
} = messageGroupsSlice.actions;

export default messageGroupsSlice.reducer;

export const {
  selectAll: selectMessageGroups,
  selectById: selectMessageGroupById
} = messageGroupsAdapter.getSelectors<RootState>(state => state.messageGroups);
