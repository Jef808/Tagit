import type {FC} from 'react';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import type {Filter} from '../stores/filters';

export const FilterListItem: FC<Filter> = (filter) => {
  const {from, subject} = filter.criteria;

  return (
    <ListItem>
      {from && (
        <span>
          {`From: ${from}`}
        </span>
      )}
      {subject && (
        <span>
          {`Subject: ${subject}`}
        </span>
      )}
    </ListItem>
  );
}
