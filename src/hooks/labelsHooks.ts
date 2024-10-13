import {
  resetLabels,
  pushLabel,
  setLabelsLoading,
  loadLabelsSuccess,
  loadLabelsFailure
} from '../stores/labels';
import type {Label} from '../stores/labels';
import {createLabel, fetchUserLabels} from '../services';
import type {AppDispatch} from '../store';

export const useFetchLabels = async (dispatch: AppDispatch) => {
  try {
    dispatch(resetLabels());
    dispatch(setLabelsLoading());
    const labels = await fetchUserLabels();
    labels.forEach((label) => dispatch(pushLabel(label)));
    dispatch(loadLabelsSuccess());
  } catch (err) {
    dispatch(loadLabelsFailure());
    console.error(err);
  }
};

export const useCreateLabel = async (dispatch: AppDispatch, labelName: string): Promise<Label | undefined> => {
  try {
    const label = await createLabel(labelName);
    dispatch(pushLabel(label));
    return label;
  } catch (err) {
    console.error(err);
  }
}
