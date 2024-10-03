import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import type {Profile} from './types';

type ProfileState = Profile & {
    status: 'idle' | 'loading' | 'failed'
};

const initialState: ProfileState = {
    emailAddress: '',
    threadsTotal: 0,
    status: 'idle'
};

export const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        setProfile: (state, action: PayloadAction<Profile>) => {
            const {emailAddress, threadsTotal} = action.payload;
            state.emailAddress = emailAddress;
            state.threadsTotal = threadsTotal;
        },
        setProfileLoading: (state) => {
            state.status = 'loading';
        },
        loadProfileSuccess: (state) => {
            state.status = 'idle';
        },
        loadProfileFailure: (state) => {
            state.status = 'failed';
        }
    }
});

export const {
    setProfile,
    setProfileLoading,
    loadProfileSuccess,
    loadProfileFailure
} = profileSlice.actions;

export default profileSlice.reducer;
