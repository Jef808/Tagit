import {createAsyncThunk, createSelector, createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '../../store';

export type Profile = {
  emailAddress: string,
  threadsTotal: number
};

type ProfileState = Profile & {
  status: 'idle' | 'loading' | 'failed'
};

const initialState: ProfileState = {
  emailAddress: '',
  threadsTotal: 0,
  status: 'idle'
};

export const fetchProfile = createAsyncThunk('profile/fetchProfile', async () => {
  return await fetch('http://localhost:3030/profile').then(res => res.json());
});

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchProfile.fulfilled, (state, action: PayloadAction<Profile>) => {
        const {emailAddress, threadsTotal} = action.payload;
        state.emailAddress = emailAddress;
        state.threadsTotal = threadsTotal;
        state.status = 'idle';
      })
      .addCase(fetchProfile.rejected, (state) => {
        state.status = 'failed';
      });
  }
});

export default profileSlice.reducer;

export const selectProfileStatus = createSelector(
  (state: RootState) => state.profile,
  profile => profile.status
);

export const selectProfile = createSelector(
  (state: RootState) => state.profile,
  ({emailAddress, threadsTotal}) => ({emailAddress, threadsTotal})
);
