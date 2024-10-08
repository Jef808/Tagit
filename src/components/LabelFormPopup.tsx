import type {FC, FormEvent} from 'react';
import {useState} from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {styled} from '@mui/material/styles';
import type {Filter} from '../stores/filters';

type FormDialogProps = {
  fromValue: string,
  open: boolean,
  onClose: () => void,
  onSubmit: (data: FormData) => void
};

const formatFromValue = (fromValue: string) => {
  const split = fromValue.split(' <');
  if (split.length === 1) {
    return [fromValue, ''];
  }
  const name = ''.concat(split.slice(0, -1));
  const email = split.slice(-1)[0].slice(0, -1);
  return [name, email];
};

export const LabelFormPopup: FC<Filter> = ({fromValue, open, onClose, onSubmit}) => {
  const [name, email] = formatFromValue(fromValue);
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        component: 'form',
        onSubmit: (event: FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          onSubmit(formData);
          onClose();
        }
      }}
    >
      <DialogTitle>
        {name}<br />{`<${email}>`}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Automatically label emails sent from {email || name}.
          In case the label does not already exist, a new one will be created.
        </DialogContentText>
        <TextField
          autoFocus
          required
          margin="dense"
          id="name"
          name="label"
          label="Label Name"
          type="text"
          fullWidth
          variant="standard"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit">Create</Button>
      </DialogActions>
    </Dialog>
  );
};
