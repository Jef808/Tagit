import {configureStore} from '@reduxjs/toolkit';
import {profileReducer} from './stores/profile';
import {labelsReducer} from './stores/labels';
import {filtersReducer} from './stores/filters';
import {messageGroupsReducer} from './stores/messageGroups';

const store = configureStore({
  reducer: {
    profile: profileReducer,
    labels: labelsReducer,
    filters: filtersReducer,
    messageGroups: messageGroupsReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
