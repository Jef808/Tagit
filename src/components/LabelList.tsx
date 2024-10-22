import type {FC, MouseEvent} from 'react';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import {LabelListItem} from './LabelListItem';
import {useAppDispatch, useAppSelector} from '../hooks';
import {
  type Label,
  selectUserLabels,
  selectSelectedLabel,
  setSelectedLabel,
} from '../stores/labels';

export const LabelList: FC = () => {
  const dispatch = useAppDispatch();
  const labels = useAppSelector(selectUserLabels);
  const selectedLabel = useAppSelector(selectSelectedLabel);

  const onClick = (labelId: string) => {
    dispatch(setSelectedLabel(labelId));
  };

  return (
    <List
      sx={{
        width: '100%',
        maxWidth: 360,
        overflow: 'auto',
        maxHeight: 440,
        bgcolor: 'background.paper',
        border: '1px solid grey',
        borderRadius: 3
      }}
      aria-labelledby="label-list-subheader"
      subheader={
        <>
          <ListSubheader component="div" id="label-list-subheader">
            Labels
          </ListSubheader>
          <Divider />
        </>
      }
    >
      {labels.map((label) => (
        <LabelListItem
          key={label.id}
          selected={selectedLabel === label.id}
          onClick={(event) => onClick(label.id)}
          label={label}
        />
      ))}
    </List>
  );
}
