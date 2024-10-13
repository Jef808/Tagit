import type {Filter} from '../stores/filters';

export type CreateFilterParams = {
  email: string;
  labelId: string;
};

export const fetchFilters = async (): Promise<Filter[]> => {
  const res = await fetch('http://localhost:3030/filters');
  const resJson = await res.json();
  return resJson;
};

export const createFilter = async ({email, labelId}: CreateFilterParams): Promise<Filter> => {
  const res = await fetch('http://localhost:3030/filters', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({email, labelId})
  });
  const resJson = await res.json();
  return resJson;
};
