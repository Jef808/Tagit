import {createAsyncThunk, createEntityAdapter, createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '../../store';

interface MessageGroup {
  id: string;
  count: number;
}

const messageGroupsAdapter = createEntityAdapter<MessageGroup>();

const initialState = messageGroupsAdapter.getInitialState({
  status: 'idle'
} as {status: 'idle' | 'loading' | 'failed'});

export const fetchMessageGroups = createAsyncThunk('messageGroups/fetchMessageGroups', async () => {
  const messageGroups = await fetch('http://localhost:3030/messageGroups').then(res => res.json());
  console.log(messageGroups);
  return Object.entries(messageGroups).map(([fromHeader, count]) => ({
    id: fromHeader,
    count
  } as MessageGroup));
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
      .addCase(fetchMessageGroups.fulfilled, (state, action: PayloadAction<MessageGroup[]>) => {
        messageGroupsAdapter.upsertMany(state, action.payload);
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
