import type {FC} from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import {
  type Filter,
  selectFilters,
  selectFiltersStatus,
} from '../stores/filters';
import {useAppSelector} from '../hooks';
import {selectSelectedLabel} from '../stores/labels';

const extractData = (filter: Filter) => {
  const {from, subject} = filter.criteria;
  return {id: filter.id, from, subject};
};

export const FilterList: FC = () => {
  const selectedLabelId = useAppSelector(selectSelectedLabel);
  const filters = useAppSelector(selectFilters);
  const filtersStatus = useAppSelector(selectFiltersStatus);

  const labelFilters = filters.filter(filter => filter.action.addLabelIds.includes(selectedLabelId));

  return (
    <Paper
      sx={{width: '100%', overflow: 'hidden', border: '1px solid grey', borderRadius: 3}}
    >
      <TableContainer sx={{maxHeight: 440}}>
        <Table stickyHeader aria-label="filters table" size="small">
          <TableHead>
            <TableRow>
              <TableCell
                align="center"
                colSpan={2}
                sx={{padding: 1.5, color: 'rgba(255, 255, 255, 0.7)'}}
              >
                Filters
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell key={'from'}>From</TableCell>
              <TableCell key={'subject'} align="right">Subject</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {labelFilters.map((filter) => {
              const data = extractData(filter);
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={data.id}>
                  <TableCell key="from">
                    {data.from}
                  </TableCell>
                  <TableCell key="subject" align="right">
                    {data.subject}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
