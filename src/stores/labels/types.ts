export type Label = {
  id: string,
  name: string,
  type: 'user' | 'system',
  threadsTotal: number,
  color?: {
    textColor: string,
    backgroundColor: string
  }
};
