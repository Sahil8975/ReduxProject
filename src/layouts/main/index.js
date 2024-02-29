import { Outlet } from 'react-router-dom';
// material
import { Box, Container } from '@mui/material';
//

// ----------------------------------------------------------------------

export default function MainLayout() {
  return (
    <>
      <div>
        <Outlet />
      </div>
    </>
  );
}
