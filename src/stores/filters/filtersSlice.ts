import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import type {Filter} from './types';

type FiltersState = {
  filters: Filter[],
  status: 'idle' | 'loading' | 'failed'
};

const initialState: FiltersState = {
  filters: [],
  status: 'idle'
};

export const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    pushFilter: (state, action: PayloadAction<Filter>) => {
      state.filters.push(action.payload);
    },
    setFiltersLoading: (state) => {
      state.status = 'loading';
    },
    loadFiltersSuccess: (state) => {
      state.status = 'idle';
    },
    loadFiltersFailure: (state) => {
      state.status = 'failed';
    },
    resetFilters: () => initialState
  }
});

export const {
  pushFilter,
  setFiltersLoading,
  loadFiltersSuccess,
  loadFiltersFailure,
  resetFilters
} = filtersSlice.actions;

export default filtersSlice.reducer;
