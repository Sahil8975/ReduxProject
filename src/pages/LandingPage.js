import React, { useState, useEffect } from 'react';
// material
import { experimentalStyled as styled } from '@mui/material/styles';
// components
import DialogComponent from '../components/Dialog';
import Page from '../components/Page';
import { STATUS } from '../utils/constants';
import { LandingHero, LandingMinimal } from '../components/_external-pages/landing';
// ----------------------------------------------------------------------

const RootStyle = styled(Page)({
  height: '100%'
});

const ContentStyle = styled('div')(({ theme }) => ({
  overflow: 'hidden',
  position: 'relative',
  backgroundColor: theme.palette.background.default
}));

// ----------------------------------------------------------------------

export default function LandingPage() {
  const [showConfirmBox, setShowConfirmBox] = useState(false);

  useEffect(() => {
    setShowConfirmBox(true);
  }, []);

  return (
    <RootStyle title="Reza Hygiene OMS" id="move_top">
      <LandingHero />
      <DialogComponent
        open={showConfirmBox}
        handleClose={() => setShowConfirmBox(false)}
        titleType={STATUS.WARNING}
        title="Set Your Display Name"
        content="Please enter your display name under settings"
        isProceedButton={false}
        isCancelButton
        cancelButtonText="Ok"
        color="success"
      />
    </RootStyle>
  );
}
