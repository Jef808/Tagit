import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice
} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '../../store';
import {type Filter, createFilter} from '../../stores/filters';

export type MessageGroup = {
  id: string;
  count: number;
  labelled: boolean;
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
    count,
    labelled: false
  } as MessageGroup));

  return {
    messageGroups,
    nextPageToken
  };
});

export const applyLabel = createAsyncThunk('messageGroups/applyLabel', async (payload: {id: string, labelId: string}) => {
  await fetch('http://localhost:3030/messages/label', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(payload)
  });
  return payload.id;
});

const messageGroupsSlice = createSlice({
  name: 'messageGroups',
  initialState,
  reducers: {
    setMessageGroupsFiltered: (state, action: PayloadAction<string[]>) => {
      messageGroupsAdapter.updateMany(
        state,
        action.payload.map(id => ({id, changes: {labelled: true}}))
      );
    }
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
      })
      .addCase(applyLabel.fulfilled, (state, action: PayloadAction<string>) => {
        messageGroupsAdapter.updateOne(state, {id: action.payload, changes: {labelled: true}});
      });
  }
});

export default messageGroupsSlice.reducer;

export const {setMessageGroupsFiltered} = messageGroupsSlice.actions;

export const {
  selectAll: selectMessageGroups,
  selectById: selectMessageGroupById
} = messageGroupsAdapter.getSelectors<RootState>(state => state.messageGroups);

export const selectMessageGroupsStatus = createSelector(
  (state: RootState) => state.messageGroups,
  messageGroups => messageGroups.status
);

export const selectMessageGroupsNextPageToken = createSelector(
  (state: RootState) => state.messageGroups,
  messageGroups => messageGroups.nextPageToken
);

export const selectUnlabelledMessageGroups = createSelector(
  selectMessageGroups,
  messageGroups => messageGroups.filter(msg => !msg.labelled)
);

export const selectMessageGroupsByEmail = createSelector(
  selectMessageGroups,
  (_: RootState, email: string) => email,
  (messageGroups, email) => {
    return messageGroups.filter(({id}) => id.includes(email));
  }
);
