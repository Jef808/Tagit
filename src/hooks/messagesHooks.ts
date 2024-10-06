import {
  resetMessages,
  pushMessage,
  upsertMessage,
  setNextPageToken,
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
    const {messages, nextPageToken} = await fetchMessages();
    dispatch(setNextPageToken(nextPageToken));
    messages.forEach((message) => dispatch(pushMessage(message)));
    dispatch(loadMessagesSuccess());
  } catch (err) {
    dispatch(loadMessagesFailure());
    console.error('@hooks/messagesHooks:useFetchMessages:', err);
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
