import type {Label} from '../stores/labels';

export type ApplyLabelParams = {
  labelId: string,
  email: string
};

export const fetchUserLabels = async (): Promise<Label[]> => {
    const res = await fetch('http://localhost:3030/labels');
    const resJson = await res.json();
    return resJson.filter(({type}: {type: string}) => type === 'user');
};

export const createLabel = async (name: string): Promise<Label> => {
  const res = await fetch('http://localhost:3030/labels', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({name})
  });
  const {id, threadsTotal, color} = await res.json();
  return {id, name, threadsTotal, color};
};

export const applyLabel = async ({labelId, email}: ApplyLabelParams) => {
  await fetch('http://localhost:3030/messages/label', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({labelId, email})
  });
};
