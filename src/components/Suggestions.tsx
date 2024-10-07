import type {FC} from 'react';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import {useAppSelector} from '../hooks';
import type {MessageMetadata} from '../stores/messages/types';

type GroupedMessages = {
  [from: string]: MessageMetadata[];
};

type SuggestionsProps = {
  messages: MessageMetadata[];
  onLoadMore: () => void;
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

export const Suggestions: FC<SuggestionsProps> = ({messages, onLoadMore}) => {
  const labelIds = useAppSelector((state) => state.labels.labels).map(label => label.id);
  const groupedMessages = groupMessagesByFrom(messages, labelIds);

  return (
    <Stack>
      <Paper
        sx={{width: '100%', overflow: 'hidden', border: '1px solid grey', borderRadius: 3}}
      >
        <TableContainer sx={{maxHeight: 440}}>
          <Table stickyHeader aria-label="messages table">
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
                <TableCell key="numMessages">Number of Messages</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(groupedMessages).map(([from, messageGroup]) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={from}>
                  <TableCell key="from">
                    {from}
                  </TableCell>
                  <TableCell key="numMessages" align="right">
                    {messageGroup.length}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <button onClick={(event) => onLoadMore()}>
        Load More
      </button>
    </Stack>
  );
};
