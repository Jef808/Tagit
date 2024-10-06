import type {FC} from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import type {Label} from '../stores/labels';

type LabelListItemProps = {
  selected: boolean,
  onClick: (event: MouseEvent<HTMLDivElement, MouseEvent>) => void,
  label: Label
};

export const LabelListItem: FC<LabelListItemProps> = ({
  selected,
  onClick,
  label
}) => {
  const {id, name, threadsTotal} = label;
  return (
    <ListItemButton
      selected={selected}
      onClick={onClick}
    >
      <ListItemText
        primary={name}
        secondary={threadsTotal}
      />
    </ListItemButton>
  );
};
