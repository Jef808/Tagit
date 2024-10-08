import type {Label} from '../stores/labels';

const fetchUserLabels = async () => {
    const res = await fetch('http://localhost:3030/labels');
    const resJson = await res.json();
    return resJson.filter(({type}: {type: string}) => type === 'user');
};

const fetchLabelInfo = async (_id: string) => {
    const res = await fetch(`http://localhost:3030/labels/${_id}`);
    const {id, name, threadsTotal, color} = await res.json();
    return {id, name, threadsTotal, color};
};

export const fetchLabels = async (): Promise<Label[]> => {
    const userLabels = await fetchUserLabels();
    const result = await Promise.all(
      userLabels.map(async ({id: _id}: {id: string}) => {
        const {id, name, threadsTotal, color} = await fetchLabelInfo(_id);
          return {id, name, threadsTotal, color};
      })
    );
    return result;
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
}
