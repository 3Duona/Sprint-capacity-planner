import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

interface DialogProps {
  dialogContent: React.ReactNode;
  dialogTitle: string;
  leftButtonText?: string;
  rightButtonText?: string;
  isDialogOpen: boolean;
  maxWidthXl?: boolean;
  onLeftButtonClick?(): void;
  onRightButtonClick?(): void;
  onDialogClose(): void;
}

const TwoButtonDialog: React.FC<DialogProps> = ({
  dialogContent,
  dialogTitle,
  leftButtonText,
  rightButtonText,
  maxWidthXl,
  onLeftButtonClick,
  onRightButtonClick,
  onDialogClose,
  isDialogOpen,
}: DialogProps) => {
  return (
    <Dialog maxWidth={maxWidthXl && 'xl'} onClose={onDialogClose} open={isDialogOpen}>
      <DialogTitle>{dialogTitle}</DialogTitle>
      <DialogContent>{dialogContent}</DialogContent>
      <DialogActions>
        <Button color="primary" onClick={onLeftButtonClick}>
          {leftButtonText}
        </Button>
        <Button color="secondary" onClick={onRightButtonClick}>
          {rightButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TwoButtonDialog;
