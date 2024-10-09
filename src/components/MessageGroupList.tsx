import type {FC} from 'react';
import {useState} from 'react';
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
import type {MessageMetadata} from '../stores/messages/types';

type MessageGroupListProps = {
  messages: MessageMetadata[];
  labels: Label[];
  onLoadMore: () => void;
  onMessageClick: (fromValue: string) => void;
  messagesStatus: 'idle' | 'loading' | 'failed';
};

type GroupedMessages = {
  [from: string]: MessageMetadata[];
};

const groupMessagesByFrom = (messages: MessageMetadata[], ignoredLabels: string[]): GroupedMessages => {
  return messages.reduce((acc: GroupedMessages, message) => {
    const from = message.from || 'Unknown';
    const labelIds = message.labelIds;
    if (labelIds.some((id) => ignoredLabels.includes(id))) {
      return acc;
    }
    if (!acc[from]) {
      acc[from] = [];
    }
    acc[from].push(message);
    return acc;
  }, {});
};

type Data = {
  from: string;
  numMessages: number;
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

export const MessageGroupList: FC<MessageGroupListProps> = ({messages, labels, onLoadMore, onMessageClick, messagesStatus}) => {
  const labelIds = labels.map(label => label.id);
  const groupedMessages = groupMessagesByFrom(messages, labelIds);
  const data = Object.entries(groupedMessages).map(([from, messageGroup]) => {
    return {
      from,
      numMessages: messageGroup.length
    };
  }).sort((a, b) => b.numMessages - a.numMessages);

  return (
    <>
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
              {data.map(({from, numMessages}) => (
                <TableRow
                  hover
                  onClick={(event) => onMessageClick(parseFromHeader(from))}
                  role="checkbox"
                  tabIndex={-1}
                  key={from}
                  sx={{cursor: 'pointer'}}
                >
                  <TableCell key="from">{from}</TableCell>
                  <TableCell key="numMessages" align="right">
                    {numMessages}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Button
          onClick={(event) => onLoadMore()}
          variant="contained"
          disabled={messagesStatus === 'loading'}
          sx={{width: '100%'}}
        >
          {messagesStatus === 'loading' ? "Loading..." : "Load More"}
        </Button>
      </Paper>
    </>
  );
};
