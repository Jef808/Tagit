import type {FC} from 'react';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import type {Filter} from '../stores/filters';

export const FilterListItem: FC<Filter> = (filter) => {
  const {from, subject} = filter.criteria;

  const props = {};
  from && (props.primary = `From: ${from}`);
  subject && (props.secondary = `Subject: ${subject}`);

  return (
      <ListItem>
        <ListItemText {...props} />
      </ListItem>
  );
}
