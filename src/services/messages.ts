import type {Header, Message, MessageMetadata} from '../stores/messages';

export const fetchMessages = async (): Promise<Message[]> => {
  const res = await fetch('http://localhost:3030/messages');
  const resData = await res.json();
  return resData;
};

export const fetchMessageMetadata = async (_id: string): Promise<MessageMetadata> => {
  const res = await fetch(`http://localhost:3030/messages/${_id}`);
  const resData = await res.json();
  const headers = resData.payload.headers as Header[];
  const date = headers.find(header => header.name === 'Date')?.value;
  const from = headers.find(header => header.name === 'From')?.value;
  const subject = headers.find(header => header.name === 'Subject')?.value;
  const {
    id,
    threadId,
    labelIds,
  } = resData;
  return {
    id, threadId, labelIds, date, from, subject
  };
}
