import type {Message, MessageMetadata} from '../stores/messages';

export const fetchMessages = async (): Promise<Message[]> => {
  const res = await fetch('http://localhost:3030/messages');
  const resData = await res.json();
  return resData;
};

export const fetchMessageMetadata = async (_id: string): Promise<MessageMetadata> => {
  const res = await fetch(`http://localhost:3030/messages/${_id}`);
  const resData = await res.json();
  const {
    id,
    threadId,
    labelIds,
    headers: {payload: headers}
  } = resData;
  return {
    id, threadId, labelIds, headers
  };
}
