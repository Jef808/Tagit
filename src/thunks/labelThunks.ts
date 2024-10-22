import {createAsyncThunk} from '@reduxjs/toolkit';
import {RootState} from '../store';
import {createLabel, fetchLabels} from '../stores/labels';
import {createFilter} from '../stores/filters';
import {applyLabel} from '../stores/messageGroups';

export const applyLabelToMessageGroup = createAsyncThunk(
  'label/applyToMessageGroup',
  async (payload: {
    labelName: string,
    filterFrom: string
  }, {getState, dispatch}) => {
    const state = getState() as RootState;

    // Create new label if necessary
    let label = Object.values(state.labels.entities).find(l => l.name === payload.labelName);
    if (!label) {
      label = await dispatch(createLabel(payload.labelName)).unwrap();
      if (!label) return null;
    }

    // Create filter if necessary
    let filter = Object.values(state.filters.entities).find((f) => {
      const criteriaFound = f.criteria.from === payload.filterFrom;
      const actionFound = f.action.addLabelIds.includes(label.id);
      return criteriaFound && actionFound;
    });
    if (!filter) {
      filter = await dispatch(createFilter({email: payload.filterFrom, labelId: label.id})).unwrap();
      if (!filter) return null;
    }

    await dispatch(applyLabel({
      id: payload.filterFrom,
      labelId: label.id,
    }));

    dispatch(fetchLabels());
  }
)
