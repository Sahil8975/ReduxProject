import React, { useState, useCallback } from 'react';
import { Box, Button, Grid, Typography, Divider } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import BasicDatePicker from '../components/pickers/BasicDatePicker';
import UploadFile from '../components/UploadFile';
import Avatar from '../components/Avatar';
import alertDialog from '../components/AlertDialog';
import Dialog from '../components/Dialog';
import { UploadAvatar } from '../components/upload';
import CustomersList from './Customers/CustomersList';
import MyComponent from './MyComponent';

function ComponentsPage() {
  const [isAlertDialogOpen, setAlertDialogOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [multipleImages, setMultipleImages] = useState({ images: [] });

  // Handle alert dialog success method
  const handleAlertDialogSubmit = () => {
    setAlertDialogOpen(false);
  };

  // Handle alert dialog close method
  const handleAlertDialogClose = () => {
    setAlertDialogOpen(false);
  };

  // Handle open dialog
  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };

  // Handle close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Handle select avatar
  const handleDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setAvatarUrl({ ...file, preview: URL.createObjectURL(file) });
    }
  });

  // handle change selected file
  const handleDropMultiple = useCallback((acceptedFiles) => {
    setMultipleImages({
      ...multipleImages,
      images: acceptedFiles?.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file)
        })
      )
    });
  });

  // handle remove selcted file
  const handleRemove = (file) => {
    const filteredItems = multipleImages?.images?.filter((_file) => _file !== file);
    setMultipleImages({ ...multipleImages, images: filteredItems });
  };

  console.log('Multiple files....', multipleImages.images);
  return (
    <div>
      {isAlertDialogOpen &&
        alertDialog({
          title: 'Delete Record',
          description: 'Do you want to delete record ?',
          isOpen: isAlertDialogOpen,
          handleClose: handleAlertDialogClose,
          handleSubmit: handleAlertDialogSubmit,
          negativeText: 'No',
          positiveText: 'Yes'
        })}

      {openDialog && (
        <Dialog open={openDialog} handleClose={handleCloseDialog} component={<MyComponent title="prop title" />} />
      )}

      <div className="rel">
        <Grid container spacing={3}>
          <Grid style={{ margin: '1rem' }} item xs={12} sm={6}>
            <Typography variant="h6">Upload File Component</Typography>
          </Grid>

          {/* Upload single and multiple file Component Section */}
          <Grid style={{ display: 'flex', alignItems: 'center' }} item xs={12} sm={6}>
            <UploadFile
              showPreview
              maxSize={3145728}
              accept="application/pdf,image/*"
              files={multipleImages.images}
              onDrop={handleDropMultiple}
              onRemove={handleRemove}
              backgroundColor="green"
              startIcon={<PhotoCamera />}
              title="Upload"
            />
          </Grid>
        </Grid>
        <Divider style={{ backgroundColor: '#212B36', marginTop: '1rem' }} />

        {/* Avatar Component Section */}
        <Grid container spacing={3}>
          <Grid style={{ margin: '1rem' }} item xs={12} sm={6}>
            <Typography variant="h6">Avatar Component</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Grid style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
              <Avatar
                imageUrl="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGivCVVA4jLOLrrcAGwiCLl1q8pmvWZegpZQ&usqp=CAU"
                width={56}
                height={56}
                variant="square"
              />
              <Avatar alt="hello" imageUrl={null} width={36} height={36} fallbacks="N" />

              <Avatar
                imageUrl="data:image/png;base64,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"
                width={56}
                height={56}
                variant="rounded"
              />
            </Grid>
          </Grid>
        </Grid>
        <Divider style={{ backgroundColor: '#212B36', marginTop: '1rem' }} />

        {/* Confirmation Dialog Section */}
        <Grid container spacing={3}>
          <Grid style={{ margin: '1rem' }} item xs={12} sm={12}>
            <Typography variant="h6">Alert Dialog Component</Typography>
          </Grid>
          <Grid style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} item xs={12} sm={3}>
            <Button onClick={() => setAlertDialogOpen(true)} variant="contained">
              Confirm me
            </Button>
          </Grid>

          {/* Open dialog Component */}
          <Grid item xs={12} sm={12}>
            <Button variant="outlined" onClick={handleClickOpenDialog}>
              Open full-screen dialog
            </Button>
          </Grid>

          {/* Upload Avatar Component */}
          <Grid item xs={12} sm={12}>
            <Box sx={{ mb: 5 }}>
              <UploadAvatar
                accept="image/*"
                file={avatarUrl}
                maxSize={3145728}
                onDrop={handleDrop}
                caption={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 2,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.secondary'
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                  </Typography>
                }
              />
            </Box>
          </Grid>
        </Grid>
        <Divider style={{ backgroundColor: '#212B36', marginTop: '1rem' }} />

        {/* Date Picker Component */}
        <Grid container spacing={3}>
          <Grid style={{ margin: '1rem' }} item xs={12} sm={12}>
            <Typography variant="h6">Date-Time Picker Component</Typography>
          </Grid>
          <Grid style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} item xs={12} sm={3}>
            <BasicDatePicker label="Select Date" />
          </Grid>
        </Grid>
        <Divider style={{ backgroundColor: '#212B36', marginTop: '1rem' }} />

        {/* Customers List Picker Component */}
        <Grid container spacing={3}>
          <Grid style={{ margin: '1rem' }} item xs={12} sm={12}>
            <Typography variant="h6">Customers List Component</Typography>
          </Grid>
          <Grid style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} item xs={12} sm={3}>
            <CustomersList />
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default ComponentsPage;
