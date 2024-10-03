import {configureStore} from '@reduxjs/toolkit';
import {profileReducer} from './stores/profile';
import {labelsReducer} from './stores/labels';

const store = configureStore({
  reducer: {
    profile: profileReducer,
    labels: labelsReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
