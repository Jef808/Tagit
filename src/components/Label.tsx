import type {FC} from 'react';
import type {Color} from '../colors';
import type {Label} from '../stores/labels';

export const Label: FC<Label> = ({
  id,
  name,
  threadsTotal
}: LabelProps) => {
  return (
    <div>
      <h4>{name}</h4>
      <span>{`# ${threadsTotal}`}</span>
    </div>
  );
};
