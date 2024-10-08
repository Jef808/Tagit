import {
  upsertMessage,
  setPageToken,
  setMessagesLoading,
  loadMessagesSuccess,
  loadMessagesFailure
} from '../stores/messages';
import {fetchMessages, fetchMessageMetadata} from '../services';
import type {AppDispatch} from '../store';

export const useFetchMessage = async (dispatch: AppDispatch, id: string) => {
  try {
    const message = await fetchMessageMetadata(id);
    dispatch(upsertMessage(message));
  } catch (err) {
    console.error(err);
  }
};

export const useFetchMessages = async (dispatch: AppDispatch, pageToken?: string) => {
  try {
    dispatch(setMessagesLoading());
    const {messages, nextPageToken} = await fetchMessages(pageToken);
    dispatch(setPageToken(nextPageToken));
    messages.forEach((message) => {
      useFetchMessage(dispatch, message.id);
    });
    dispatch(loadMessagesSuccess());
  } catch (err) {
    dispatch(loadMessagesFailure());
    console.error('@hooks/messagesHooks:useFetchMessages:', err);
  }
};
