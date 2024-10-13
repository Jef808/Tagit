import {useEffect} from 'react';
import type {FC} from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableFooter from '@mui/material/TableFooter';
import type {Label} from '../stores/labels';
import type {MessageGroup} from '../stores/messageGroups';

type MessageGroupListProps = {
  messageGroups: MessageGroup[];
  labels: Label[];
  onLoadMore: () => void;
  onMessageClick: (fromValue: string) => void;
  messagesStatus: 'idle' | 'loading' | 'failed';
};

const parseFromHeader = (fromHeader: string) => {
  const split = fromHeader.split(' <');
  if (split.length === 1) {
    return ['', fromHeader];
  }
  const name = ''.concat(split.slice(0, -1));
  const email = split.slice(-1)[0].slice(0, -1);
  return [name, email];
};

export const MessageGroupList: FC<MessageGroupListProps> = ({messageGroups, onLoadMore, onMessageClick, messageGroupsStatus}) => {
  const sortedMessageGroups = messageGroups.sort((a, b) => b.count - a.count);
  return (
    <Paper
      sx={{width: '100%', overflow: 'hidden', border: '1px solid grey', borderRadius: 3}}
    >
      <TableContainer sx={{maxHeight: 440}}>
        <Table stickyHeader aria-label="messages table" size="small">
          <TableHead>
            <TableRow>
              <TableCell
                align="center"
                colSpan={2}
                sx={{padding: 1.5, color: 'rgba(255, 255, 255, 0.7)'}}
              >
                Unlabeled Messages
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell key="from">From</TableCell>
              <TableCell key="numMessages" align="right">Messages</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedMessageGroups.map(({id, count}) => (
              <TableRow
                hover
                onClick={(event) => onMessageClick(parseFromHeader(id))}
                role="checkbox"
                tabIndex={-1}
                key={id}
                sx={{cursor: 'pointer'}}
              >
                <TableCell key="from">{id}</TableCell>
                <TableCell key="numMessages" align="right">
                  {count}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button
        onClick={(event) => onLoadMore()}
        variant="contained"
        disabled={messageGroupsStatus === 'loading'}
        sx={{width: '100%'}}
      >
        {messageGroupsStatus === 'loading' ? "Loading..." : "Load More"}
      </Button>
    </Paper>
  );
};
