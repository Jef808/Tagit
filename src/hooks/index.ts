import {useDispatch, useSelector} from 'react-redux';
import type {RootState, AppDispatch} from '../store';

export {useFetchProfile} from './profileHooks';
export {useCreateLabel, useFetchLabels} from './labelsHooks';
export {useCreateFilter, useFetchFilters} from './filtersHooks';

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
