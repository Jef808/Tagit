import type {FC, MouseEvent} from 'react';
import type {Label} from '../stores/labels';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import {LabelListItem} from './LabelListItem';

type LabelListProps = {
  labels: Label[],
  selectedId: string,
  onSelect: (labelId: string) => void
};

export const LabelList: FC<LabelListProps> = ({
  labels,
  selectedId,
  onSelect
}) => {
  const sortedLabels = [...labels].sort((a, b) => b.threadsTotal - a.threadsTotal);
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
      {sortedLabels.map((label) => {
        return (
          <LabelListItem
            key={label.id}
            selected={selectedId === label.id}
            onClick={(event) => onSelect(label.id)}
            label={label}
          />
        );
      })}
    </List>
  );
};
