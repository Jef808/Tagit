import {
  resetMessages,
  pushMessage,
  upsertMessage,
  setMessagesLoading,
  loadMessagesSuccess,
  loadMessagesFailure
} from '../stores/messages';
import {fetchMessages, fetchMessageMetadata} from '../services';
import type {AppDispatch} from '../store';

export const useFetchMessages = async (dispatch: AppDispatch) => {
  try {
    dispatch(resetMessages());
    dispatch(setMessagesLoading());
    const messages = await fetchMessages();
    messages.forEach((message) => dispatch(pushMessage(message)));
    dispatch(loadMessagesSuccess());
  } catch (err) {
    dispatch(loadMessagesFailure());
    console.error(err);
  }
};

export const useFetchMessage = async (dispatch: AppDispatch, id: string) => {
  try {
    const message = await fetchMessageMetadata(id);
    dispatch(upsertMessage(message));
  } catch (err) {
    console.error(err);
  }
};
