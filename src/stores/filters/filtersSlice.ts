import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice
} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import type {CreateFilterParams, Filter} from './types';
import type {RootState} from '../../store';

const filtersAdapter = createEntityAdapter<Filter>();

const initialState = filtersAdapter.getInitialState({status: 'idle'});

export const fetchFilters = createAsyncThunk('filters/fetchFilters', async () => {
  return await fetch('http://localhost:3030/filters').then(res => res.json());
});

export const createFilter = createAsyncThunk(
  'filters/createFilter',
  async ({email, labelId}: CreateFilterParams) => {
    return await fetch('http://localhost:3030/filters', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({email, labelId})
    }).then(res => res.json());
  }
);

export const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchFilters.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchFilters.fulfilled, (state, action: PayloadAction<Filter[]>) => {
        filtersAdapter.upsertMany(state, action);
        state.status = 'idle';
      })
      .addCase(fetchFilters.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(createFilter.fulfilled, (state, action: PayloadAction<Filter>) => {
        filtersAdapter.upsertOne(state, action);
      });
  }
});

export default filtersSlice.reducer;

export const {
  selectAll: selectFilters,
  selectById: selectFilterById
} = filtersAdapter.getSelectors<RootState>(state => state.filters);

export const selectFiltersByLabel = createSelector(
  [
    selectFilters,
    (_: RootState, labelId: string) => labelId
  ],
  (filters, labelId) => {
    return filters.filter(({action}) => action.addLabelIds.includes(labelId));
  }
);
