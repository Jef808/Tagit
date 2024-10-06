import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import type {Label} from './types';

type LabelsState = {
  labels: Label[],
  status: 'idle' | 'loading' | 'failed'
};

const initialState: LabelsState = {
  labels: [],
  status: 'idle'
};

export const labelsSlice = createSlice({
  name: 'labels',
  initialState,
  reducers: {
    pushLabel: (state, action: PayloadAction<Label>) => {
      state.labels.push(action.payload);
    },
    setLabelsLoading: (state) => {
      state.status = 'loading';
    },
    loadLabelsSuccess: (state) => {
      state.status = 'idle';
    },
    loadLabelsFailure: (state) => {
      state.status = 'failed';
    },
    resetLabels: () => initialState
  }
});

export const {
  pushLabel,
  setLabelsLoading,
  loadLabelsSuccess,
  loadLabelsFailure,
  resetLabels
} = labelsSlice.actions;

export default labelsSlice.reducer;
