// material
import { Container } from '@mui/material';
import { useState, useEffect } from 'react';
// components
import Page from '../components/Page';
import SkeletonLoading from '../components/skeletons/SkeletonLoading';

// ----------------------------------------------------------------------

export default function PageFour() {
  const [Loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);
  return (
    <Page title="Page One | Minimal-UI">
      <Container maxWidth="xl">
        {Loading && <SkeletonLoading />}
        {!Loading && (
          <h1>
            <i>Coming soon...</i>
          </h1>
        )}
      </Container>
    </Page>
  );
}
