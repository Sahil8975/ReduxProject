import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Icon } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import { COMPONENTS } from '../utils/constants';
import RenderComponent from './RenderComponent';

function NotesDialog({ noteProps, handleProceed, handleClose }) {
  const {
    open,
    maxWidth,
    title,
    label,
    titleProps,
    contentProps,
    isCancelButton = true,
    cancelButtonText,
    isProceedButton = true,
    proceedButtonText,
    noteVal = '',
    noteType = '',
    maxChars = '',
    isDisabled,
    rejectType = ''
  } = noteProps;
  const [notes, setNotes] = useState({ text: '' });
  const [error, setError] = useState(false);
  const { BUTTON } = COMPONENTS;

  const noteTextComp = {
    control: COMPONENTS.TEXT_FIELD,
    key: 'text',
    variant: 'outlined',
    size: 'small',
    type: 'text',
    label,
    autoComplete: 'off',
    isMultiline: true,
    textRows: 5,
    controlStyle: { marginTop: '1rem' },
    isError:
      (error && notes.text && maxChars && notes.text.length > maxChars) ||
      (error && noteType === 'Reason' && notes.text.length === 0),
    helperText:
      (error &&
        notes.text &&
        maxChars &&
        notes.text.length > maxChars &&
        `Notes should not be more than ${maxChars} characters`) ||
      (error && noteType === 'Reason' && notes.text.length === 0 && `Please enter reason`) ||
      '',
    columnWidth: 12
  };

  const myCloseModal = (event, reason) => {
    if (reason && reason === 'backdropClick') return;
    setNotes({ text: '' });
    handleClose();
  };

  const handleNotesChangeData = (key, val) => {
    setNotes({ ...notes, [key]: val });
  };

  const checkForErrors = () => {
    if (notes.text && noteType !== 'Reason' && maxChars && notes.text.length > maxChars) {
      setError(true);
    } else if (notes.text.length === 0) {
      setError(true);
    } else {
      handleProceed(notes.text, noteType === 'Reason' ? rejectType : null);
      setError(false);
      setNotes('');
    }
  };

  useEffect(() => {
    setNotes({ text: noteVal });
  }, [noteVal]);

  useEffect(() => {
    setError(false);
  }, [notes.text]);

  return (
    <Dialog fullWidth maxWidth={maxWidth} open={open} onClose={myCloseModal}>
      <IconButton
        sx={{
          position: 'absolute',
          right: 5,
          top: 5
        }}
        onClick={myCloseModal}
      >
        <CloseIcon />
      </IconButton>
      <DialogTitle
        {...titleProps}
        sx={{ pt: '10', display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}
      >
        {title}
      </DialogTitle>
      <DialogContent {...contentProps} sx={{ pb: '0', pl: '2.1rem', wordWrap: 'break-word' }}>
        <RenderComponent
          metaData={{ ...noteTextComp }}
          payload={notes}
          ind="taskNoteTemp123"
          handleChange={handleNotesChangeData}
        />
      </DialogContent>
      <DialogActions sx={{ pb: '10', pt: '0' }}>
        {isCancelButton && (
          <RenderComponent
            metaData={{
              control: BUTTON,
              color: 'warning',
              btnTitle: cancelButtonText || 'Cancel',
              handleClickButton: () => myCloseModal(),
              groupStyle: { minWidth: '6.5rem' }
            }}
          />
        )}
        {isProceedButton && (
          <RenderComponent
            metaData={{
              control: BUTTON,
              color: 'success',
              btnTitle: proceedButtonText || 'Save',
              handleClickButton: () => checkForErrors(),
              groupStyle: { minWidth: '6.5rem' },
              isDisabled
            }}
          />
        )}
      </DialogActions>
    </Dialog>
  );
}

NotesDialog.propTypes = {
  noteProps: PropTypes.object,
  handleClose: PropTypes.func,
  handleProceed: PropTypes.func
};

export default NotesDialog;
