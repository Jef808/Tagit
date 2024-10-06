import type {FC, MouseEvent} from 'react';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import type {MessageMetadata} from '../stores/messages';

type MessageListProps = {
  messages: MessageMetadata[],
  onClick: (messageId: string) => void;
};

export const MessageList: FC<MessageListProps> = ({
  messages,
  onClick
}) => {
  return (
    <List
      subheader={
        <>
          <ListSubheader components="div" id="message-list-subheader">
            Messages
          </ListSubheader>
          <Divider />
        </>
      }
    >
      {messages.map((message) => {
        return (
          <ListItemButton key={message.id} onClick={(event) => onClick(message.id)}>
            <ListItemText primary={JSON.stringify(message, null, 2)} />
          </ListItemButton>
        );
      })}
    </List>
  );
};
