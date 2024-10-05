import {configureStore} from '@reduxjs/toolkit';
import {profileReducer} from './stores/profile';
import {labelsReducer} from './stores/labels';
import {filtersReducer} from './stores/filters';
import {messagesReducer} from './stores/messages';

const store = configureStore({
  reducer: {
    profile: profileReducer,
    labels: labelsReducer,
    filters: filtersReducer,
    messages: messagesReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
