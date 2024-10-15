import type {FC, FormEvent} from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

type LabelFormPopupProps = {
  displayName: string,
  email: string,
  open: boolean,
  onClose: () => void,
  onSubmit: (data: FormData) => void,
};

export const LabelFormPopup: FC<LabelFormPopupProps> = ({displayName, email, open, onClose, onSubmit}) => (
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
      {displayName && <>{displayName}<br /></>}
      {`<${email}>`}
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
        autoComplete="off"
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancel</Button>
      <Button type="submit">Create</Button>
    </DialogActions>
  </Dialog>
);
