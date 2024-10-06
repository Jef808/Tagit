import type {FC} from 'react';
import List from '@mui/material/List';
import type {Filter} from '../stores/filters';
import {useAppSelector} from './hooks';
import {FilterListItem} from './FilterListItem';

export const FilterList: FC<{filters: Filter[]}> = ({filters}) => (
  <List>
    {filters.map(filter => <FilterListItem key={filter.id} {...filter} />)}
  </List>
);
