import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice
} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '../../store';

export type Label = {
  id: string,
  name: string,
  type: 'user' | 'system',
  threadsTotal: number,
  color?: {
    textColor: string,
    backgroundColor: string
  }
};

const labelsAdapter = createEntityAdapter<Label>({
  sortComparer: (a, b) => b.threadsTotal - a.threadsTotal
});

const initialState = labelsAdapter.getInitialState({
  status: 'idle',
  selectedLabel: ''
});

export const fetchLabels = createAsyncThunk('labels/fetchLabels', async () => {
  return await fetch('http://localhost:3030/labels').then(res => res.json());
});

export const createLabel = createAsyncThunk('labels/createLabel', async (name: string) => {
  return await fetch('http://localhost:3030/labels', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({name})
  }).then(res => res.json());
});

export const labelsSlice = createSlice({
  name: 'labels',
  initialState,
  reducers: {
    setSelectedLabel: (state, action: PayloadAction<string>) => {
      state.selectedLabel = action.payload;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchLabels.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchLabels.fulfilled, (state, action: PayloadAction<Label[]>) => {
        labelsAdapter.upsertMany(state, action);
        state.status = 'idle';
      })
      .addCase(fetchLabels.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(createLabel.fulfilled, (state, action: PayloadAction<Label>) => {
        labelsAdapter.upsertOne(state, action);
      });
  }
});

export const {setSelectedLabel} = labelsSlice.actions;

export const {
  selectAll: selectLabels,
  selectById: selectLabelById
} = labelsAdapter.getSelectors<RootState>(state => state.labels);

export const selectLabelsStatus = createSelector(
  (state: RootState) => state.labels,
  labels => labels.status
);

export const selectUserLabels = createSelector(
  selectLabels,
  labels => labels.filter(({type}) => type === 'user')
);

export const selectSelectedLabel = createSelector(
  (state: RootState) => state.labels,
  labels => labels.selectedLabel
);

export default labelsSlice.reducer;
