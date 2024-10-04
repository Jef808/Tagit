import {
  resetLabels,
  pushLabel,
  setLabelsLoading,
  loadLabelsSuccess,
  loadLabelsFailure
} from '../stores/labels';
import {fetchLabels} from '../services';
import type {AppDispatch} from '../store';

export const useFetchLabels = async (dispatch: AppDispatch) => {
  try {
    dispatch(resetLabels());
    dispatch(setLabelsLoading());
    const labels = await fetchLabels();
    labels.forEach((label) => dispatch(pushLabel(label)));
    dispatch(loadLabelsSuccess());
  } catch (err) {
    dispatch(loadLabelsFailure());
    console.error(err);
  }
};
