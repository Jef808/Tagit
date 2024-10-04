import type {Filter} from '../stores/filters';

export const fetchFilters = async (): Promise<Filter[]> => {
  const res = await fetch('http://localhost:3030/filters');
  const resData = await res.json();
  return resData;
};
