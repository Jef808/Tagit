import {useCreateLabel} from './labelsHooks';
import {useCreateFilter} from './filtersHooks';
import type {AppDispatch} from '../store';

export const useCreateNewLabel = async (dispatch: AppDispatch, labelName: string, email: string) => {
    const label = await useCreateLabel(dispatch, labelName);
    if (label) {
        const filter = await useCreateFilter(dispatch, {email, labelId: label.id});
        return filter;
    }
};
