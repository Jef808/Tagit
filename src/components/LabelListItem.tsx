import {useState} from 'react';
import type {FC} from 'react';
import Collapse from '@mui/material/Collapse';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import {ExpandLess, ExpandMore} from '@mui/icons-material';
import type {Label} from '../stores/labels';

export const LabelListItem: FC<{key: string} & Label> = ({
  key,
  id,
  name,
  threadsTotal,
  color
}) => {
  const [open, setOpen] = useState(false);
  return (
    <ListItemButton sx={color && {bgcolor: color.backgroundColor}}>
      <ListItemText
        sx={color && {fgcolor: color.textColor}}
        primary={name}
        secondary={threadsTotal}
      />
    </ListItemButton>
  );
};
