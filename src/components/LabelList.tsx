import type {FC} from 'react';
import type {Label} from '../stores/labels';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import {LabelListItem} from './LabelListItem';

type LabelListProps = {
  labels: Label[]
};

export const LabelList: FC<LabelListProps> = ({labels}) => {
  return (
    <List
      sx={{
        width: '100%',
        maxWidth: 360,
        overflow: 'auto',
        maxHeight: 300,
        bgcolor: 'background.paper'
      }}
      aria-labelledby="label-list-subheader"
      subheader={
        <ListSubheader component="div" id="label-list-subheader">
          Labels
        </ListSubheader>
      }
    >
      {labels.map(label => <LabelListItem {...label} />)}
    </List>
  );
};
