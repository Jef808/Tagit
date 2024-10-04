import {
  resetFilters,
  pushFilter,
  setFiltersLoading,
  loadFiltersSuccess,
  loadFiltersFailure
} from '../stores/filters';
import {fetchFilters} from '../services';
import type {AppDispatch} from '../store';

export const useFetchFilters = async (dispatch: AppDispatch) => {
  try {
    dispatch(resetFilters());
    dispatch(setFiltersLoading());
    const filters = await fetchFilters();
    filters.forEach((filter) => dispatch(pushFilter(filter)));
    dispatch(loadFiltersSuccess());
  } catch (err) {
    dispatch(loadFiltersFailure());
    console.error(err);
  }
};
