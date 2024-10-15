export type Criteria = {
  from: string,
  to: string,
  subject: string,
  query: string,
  negatedQuery: string,
  hasAttachment: boolean,
  excludeChats: boolean,
  size: number,
  sizeComparison: 'unspecified' | 'smaller' | 'larger'
};

export type Action = {
  addLabelIds: string[],
  removeLabelIds: string[],
  forward: string
};

export type Filter = {
  id: string,
  criteria: Criteria,
  action: Action
};

export type CreateFilterParams = {
  email: string,
  labelId: string
};
