import {
  resetFilters,
  pushFilter,
  setFiltersLoading,
  loadFiltersSuccess,
  loadFiltersFailure
} from '../stores/filters';
import type {Filter} from '../stores/filters';
import {createFilter, fetchFilters} from '../services';
import type {CreateFilterParams} from '../services';
import type {AppDispatch} from '../store';

export const useFetchFilters = async (dispatch: AppDispatch) => {
  try {
    dispatch(resetFilters());
    dispatch(setFiltersLoading());
    const filters = await fetchFilters();
    filters.forEach(filter => dispatch(pushFilter(filter)));
    dispatch(loadFiltersSuccess());
  } catch (err) {
    dispatch(loadFiltersFailure());
    console.error(err);
  }
};

export const useCreateFilter = async (
  dispatch: AppDispatch,
  createFilterProps: CreateFilterParams
): Promise<Filter | undefined> => {
  try {
    const filter = await createFilter(createFilterProps);
    dispatch(pushFilter(filter));
    return filter;
  } catch (err) {
    console.error(err);
  }
};
