import type {Filter} from '../stores/filters';

export type CreateFilterParams = {
  email: string;
  labelId: string;
};

export const fetchFilters = async (): Promise<Filter[]> => {
  return await fetch('http://localhost:3030/filters').then(res => res.json());
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
