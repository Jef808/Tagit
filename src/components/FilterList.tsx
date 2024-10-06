import type {FC} from 'react';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import type {Filter} from '../stores/filters';
import {FilterListItem} from './FilterListItem';

export const FilterList: FC<{filters: Filter[]}> = ({filters}) => (
  <List
    sx={{
      width: '100%',
      maxWidth: 360,
      overflow: 'auto',
      maxHeight: 300,
      bgcolor: 'background.paper'
    }}
    aria-labelledby="filter-list-subheader"
    subheader={
      <ListSubheader component="div" id="filter-list-subheader">
        Filters
      </ListSubheader>
    }
  >
    {filters.map(filter => <FilterListItem key={filter.id} {...filter} />)}
  </List>
);
