import {
  setProfileLoading,
  setProfile,
  loadProfileSuccess,
  loadProfileFailure
} from '../stores/profile';
import {fetchProfile} from '../services';
import type {AppDispatch} from '../store';

export const useFetchProfile = async (dispatch: AppDispatch) => {
  dispatch(setProfileLoading());
  try {
    const profile = await fetchProfile();
    dispatch(setProfile(profile));
    dispatch(loadProfileSuccess());
  } catch (err) {
    dispatch(loadProfileFailure());
    console.error(err);
  }
};
