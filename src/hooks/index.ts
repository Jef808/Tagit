import {useDispatch, useSelector} from 'react-redux';
import type {RootState, AppDispatch} from '../store';

export {useFetchProfile} from './profileHooks';
export {useFetchLabels} from './labelsHooks';
export {useFetchFilters} from './filtersHooks';
export {useFetchMessage, useFetchMessages} from './messagesHooks';

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
