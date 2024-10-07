import type {FC} from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import type {Filter} from '../stores/filters';

interface Column {
  id: 'from' | 'subject';
  label: string;
  minWidth?: number;
  align?: 'right';
};

const columns: readonly Column[] = [
  {id: 'from', label: 'From'},
  {id: 'subject', label: 'Subject'}
];

const extractData = (filter: Filter) => {
  const {from, subject} = filter.criteria;

  return {id: filter.id, from, subject};
};

export const FilterTable: FC<{filters: Filter[]}> = ({filters}) => (
  <Paper
    sx={{width: '100%', overflow: 'hidden', border: '1px solid grey', borderRadius: 3}}
  >
    <TableContainer sx={{maxHeight: 440}}>
      <Table stickyHeader aria-label="filters table">
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
            <TableCell key={'subject'}>Subject</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filters.map((filter) => {
            const data = extractData(filter);
            return (
              <TableRow hover role="checkbox" tabIndex={-1} key={data.id}>
                {columns.map((column) => (
                  <TableCell key={column.id}>
                    {data[column.id]}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  </Paper>
);
