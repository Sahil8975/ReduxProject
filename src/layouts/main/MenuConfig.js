import { Icon } from '@iconify/react';
import homeFill from '@iconify/icons-eva/home-fill';
import fileFill from '@iconify/icons-eva/file-fill';
import { Avatar } from '@mui/material';
// routes
import { ROUTES } from '../../routes/paths';
// import Avatar from 'src/theme/overrides/Avatar';
// ----------------------------------------------------------------------

const ICON_SIZE = {
  width: 22,
  height: 22
};

const menuConfig = [
  {
    title: 'Home',
    path: ROUTES.HOME,
    icon: <Icon icon={homeFill} {...ICON_SIZE} />
  },
  { title: 'Employee', path: '/employee', icon: <Icon icon={fileFill} {...ICON_SIZE} /> },
  { title: 'Data', path: '/data', icon: <Icon icon={fileFill} {...ICON_SIZE} /> },
  { title: 'Invoice', path: '/invoice', icon: <Icon icon={fileFill} {...ICON_SIZE} /> },
  { title: 'Pay', path: '/pay', icon: <Icon icon={fileFill} {...ICON_SIZE} /> },
  { title: 'Components', path: '/components', icon: <Icon icon={fileFill} {...ICON_SIZE} /> }
];

export default menuConfig;
