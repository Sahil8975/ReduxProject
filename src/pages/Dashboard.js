import { Container } from '@mui/material';
import { useEffect, useState } from 'react';
// components
import SkeletonLoading from '../components/skeletons/SkeletonLoading';
import Page from '../components/Page';

// ----------------------------------------------------------------------

export default function Dashboard() {
  const [Loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => {};
  }, []);
  return (
    <Page title="Page One | Minimal-UI">
      <Container maxWidth="xl">
        {Loading && <SkeletonLoading />}
        {!Loading && <h1>Welcome User</h1>}
      </Container>
    </Page>
  );
}
