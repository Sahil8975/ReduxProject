import React, { useState, useEffect, useRef } from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import Button from '@mui/material/Button';
import { Dialog, DialogTitle, DialogContent, DialogActions, Box, Grid, Container, Typography } from '@mui/material';
import Page from '../Page';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1)
    }
  }
}));

const useStyless = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff'
  }
}));

const RootStyle = styled(Page)(({ theme }) => ({
  paddingTop: theme.spacing(11),
  paddingBottom: theme.spacing(15)
}));

export default function ContainedButtons({
  headertitle,
  Required,
  ch,
  heads,
  name,
  color,
  bgColor,
  clicks,
  Samplecomponent,
  head,
  requireField,
  time,
  timecomp,
  speicmen,
  SpecimenComponent,
  Sample,
  collectedComponent,
  comp4,
  remark,
  RemarkComponent,
  checkbox,
  head1,
  BarComponent,
  btnSave,
  cancel,
  scroll,
  headsss,
  Required3,
  defaultTimeComponent,
  time2,
  Required6,
  Sample1,
  dispatchComponent,
  hr,
  rejectedBY,
  rejectedBYcomp,
  rejectionComment,
  rejectionCommentcomp,
  btn,
  InformTo,
  estricInform,
  RejectComp,
  ReasonRejection,
  RejectComps,
  holdBY,
  Holdcomp,
  holdReason,
  Holdcomp1,
  additionalNotes,
  HoldComp3,
  InformToHold,
  HoldComp4,
  br,
  dispatchDate,
  outcomp,
  packingTemp,
  outComp1,
  externalLab,
  outcomp2,
  dispatcherName,
  outcomp3,
  Lpo,
  outComp4,
  sampleUploadDate,
  uploadcomp,
  uploadTime,
  uploadtimecomp,
  reportUploadby,
  reportBYcomp,
  remarks,
  uploadComp1,
  uploadfile,
  attach,
  note,
  noteComp
}) {
  const [open, setOpen] = React.useState(false);
  const [scrolls, setScrolls] = useState('paper');

  const handleClickOpen = (scrollType) => () => {
    setOpen(true);
    setScrolls(scrollType);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const descriptionElementRef = useRef(null);
  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  const classes = useStyles();
  const [click, setCLick] = useState(null);

  const pendingSample = ({ ch }) => {
    switch (ch) {
      case 'paper':
        setOpen(true);
        setScrolls(ch);
        break;
      case 'dispatch':
        setOpen(true);
        setScrolls(ch);
        break;
      case 'reject':
        setOpen(true);
        setScrolls(ch);
        break;
      case 'hold':
        setOpen(true);
        setScrolls(ch);
        break;
      case 'outsource':
        setOpen(true);
        setScrolls(ch);
        break;
      case 'upload':
        setOpen(true);
        setScrolls(ch);
        break;
      default:
        return 'foo';
    }
  };

  return (
    <div className={classes.root}>
      <Button
        variant="contained"
        onClick={() => pendingSample({ ch })}
        size="small"
        sx={{ mr: 1 }}
        style={{ color: `${color}`, backgroundColor: `${bgColor}` }}
      >
        {name}
      </Button>
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Dialog open={open} maxWidth="lg" onClose={handleClose} scroll={scroll}>
              <DialogTitle className="model-bg p-model">{headertitle}</DialogTitle>
              <DialogContent dividers={scroll === 'paper'} className="head-pd">
                {headsss}
                {heads}
                {head}
                {br}
                {hr}
                {Required}
                <div>{Samplecomponent}</div>
                {time}
                {requireField}
                {timecomp}
                {speicmen}
                {SpecimenComponent}
                {Sample}
                {collectedComponent}
                {comp4}
                {remark}
                {RemarkComponent}
                <div>{checkbox}</div>
                <div>
                  {head1}
                  {Required3}
                </div>
                {BarComponent}
                {time2}
                {Required6}
                {defaultTimeComponent}
                {Sample1}
                {dispatchComponent}
                {rejectedBY}
                {rejectedBYcomp}
                {rejectionComment}
                {estricInform}
                {rejectionCommentcomp}
                {btn}
                {InformTo}
                {estricInform}
                {RejectComp}
                {ReasonRejection}
                {RejectComps}
                {holdBY}
                {Holdcomp}
                {holdReason}
                {Holdcomp1}
                {additionalNotes}
                {HoldComp3}
                {InformToHold}
                {HoldComp4}
                {dispatchDate}
                {outcomp}
                {packingTemp}
                {outComp1}
                {externalLab}
                {outcomp2}
                {dispatcherName}
                {outcomp3}
                {Lpo}
                {outComp4}
                {sampleUploadDate}
                {uploadcomp}
                {uploadTime}
                {uploadtimecomp}
                {reportUploadby}
                {reportBYcomp}
                {attach}
                {uploadfile}
                {note}
                {noteComp}
                {remarks}
                {uploadComp1}
              </DialogContent>
              <DialogActions className="model-bg p-model border-model">
                <Button variant="contained" onClick={handleClose}>
                  Save
                </Button>
                <Button onClick={handleClose} className="close">
                  Close
                </Button>
              </DialogActions>
            </Dialog>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
