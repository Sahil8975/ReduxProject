import PropTypes from 'prop-types';
import Brightness1Icon from '@mui/icons-material/Brightness1';
import { useDropzone } from 'react-dropzone';
// material
import { alpha } from '@mui/material/styles';
import { Box, List, Paper, Typography, Grid, Tooltip } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import { MIconButton } from './@material-extend';
import { COMPONENTS } from '../utils/constants';
import RenderComponent from './RenderComponent';
import { isArray } from '../utils/utils';

export default function UploadMultiFile({
  files,
  onRemove,
  backgroundColor,
  startIcon,
  endIcon,
  buttonLabel,
  checkEmpty,
  eventCalled,
  isRequired,
  uploadBtnStyles,
  filesStyles,
  isDisabled = false,
  showCloseBtn = true,
  isFileUploadMandatory = true,
  noFileText = 'No File Uploaded, Kindly upload a PDF file.',
  isError,
  showPreview,
  ...other
}) {
  const hasFile = files && files.length > 0;
  const { BUTTON } = COMPONENTS;

  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    ...other
  });

  const showFileEmpty = () => (
    <Paper
      variant="elevation"
      sx={{
        px: 1
        // borderColor: (isFileUploadMandatory && 'error.light') || 'inherit',
        // bgcolor: (theme) => alpha(theme.palette.error.main, 0.08)
      }}
    >
      <Box sx={{ my: 1 }}>
        {/* <Typography variant="subtitle2">No File Uploaded</Typography> */}
        <Typography variant="caption" component="p" sx={{ color: isError ? 'red' : '' }}>
          {noFileText}
        </Typography>
      </Box>
    </Paper>
  );

  const ShowRejectionItems = () => (
    <Paper
      variant="outlined"
      sx={{
        py: 1,
        px: 2,
        mt: 3,
        borderColor: 'error.light',
        bgcolor: (theme) => alpha(theme.palette.error.main, 0.08)
      }}
    >
      {fileRejections?.map(({ file, errors }) => {
        const { path } = file;
        return (
          <Box key={path} sx={{ my: 1 }}>
            <Typography variant="subtitle2" noWrap>
              {path}
            </Typography>
            {errors?.map((e) => (
              <Typography key={e.code} variant="caption" component="p">
                File can't be uploaded. Kindly upload PDF (.pdf extension) file only.
              </Typography>
            ))}
          </Box>
        );
      })}
    </Paper>
  );

  return (
    <Box>
      <Grid item xs={12} display="flex" justifyContent="center" alignItems="center">
        <Grid item xs={5}>
          <div {...getRootProps()} style={uploadBtnStyles}>
            <input {...getInputProps()} disabled={isDisabled} />
            <RenderComponent
              metaData={{
                control: BUTTON,
                isDisabled,
                color: 'success',
                size: 'small',
                btnTitle: `${!buttonLabel ? 'Upload' : `${buttonLabel}${isRequired ? '*' : ''}`}`,
                startIcon,
                endIcon,
                columnWidth: 12
              }}
            />
          </div>
        </Grid>
        <Grid item xs={7}>
          {/* {!checkEmpty && fileRejections.length === 0 && eventCalled ? showFileEmpty() : null} */}
          <List disablePadding sx={{ ...(hasFile && { my: 3 }) }} style={filesStyles}>
            {isArray(files)
              ? files?.map((file, ind) => {
                  const { name, originalFileName } = file;
                  return (
                    <Grid key={ind} container spacing={3}>
                      <Grid item xs={12} style={{ display: 'flex', alignItems: 'center' }}>
                        <Grid item xs={11} style={{ display: 'flex', alignItems: 'center' }}>
                          <Brightness1Icon style={{ fontSize: '10px', marginRight: '1rem', color: 'green' }} />
                          <Typography component="p" style={{ wordWrap: 'break-word' }}>
                            {name || originalFileName}
                          </Typography>
                        </Grid>
                        <Grid item xs={1}>
                          {showCloseBtn && (
                            <Tooltip title="Remove">
                              <MIconButton
                                edge="end"
                                size="small"
                                onClick={() => onRemove(file)}
                                disabled={isDisabled}
                                style={{ marginLeft: '-0.5rem' }}
                              >
                                <CancelIcon
                                  style={{
                                    cursor: 'pointer',
                                    color: isDisabled ? 'lightgray' : 'red',
                                    fontSize: '18px'
                                  }}
                                />
                              </MIconButton>
                            </Tooltip>
                          )}
                        </Grid>
                      </Grid>
                    </Grid>
                  );
                })
              : showFileEmpty()}
          </List>
        </Grid>
      </Grid>
    </Box>
  );
}

UploadMultiFile.propTypes = {
  error: PropTypes.bool,
  showPreview: PropTypes.bool,
  files: PropTypes.array,
  onRemove: PropTypes.func,
  onRemoveAll: PropTypes.func,
  sx: PropTypes.object,
  backgroundColor: PropTypes.string,
  startIcon: PropTypes.symbol,
  endIcon: PropTypes.symbol,
  buttonLabel: PropTypes.string,
  checkEmpty: PropTypes.bool,
  eventCalled: PropTypes.bool,
  isRequired: PropTypes.bool
};
