import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { NavLink as RouterLink, matchPath, useLocation } from 'react-router-dom';
import arrowIosForwardFill from '@iconify/icons-eva/arrow-ios-forward-fill';
import arrowIosDownwardFill from '@iconify/icons-eva/arrow-ios-downward-fill';
// material
import { alpha, useTheme, experimentalStyled as styled } from '@mui/material/styles';
import { Box, List, ListItem, Collapse, ListItemText, ListItemIcon, Typography } from '@mui/material';
import { isArray } from '../utils/utils';
import { FontFamily } from '../utils/constants';

const ListItemStyle = styled((props) => <ListItem button disableGutters {...props} />)(({ theme }) => ({
  ...theme.typography.body2,
  height: 48,
  position: 'relative',
  textTransform: 'capitalize',
  paddingLeft: theme.spacing(3.8),
  paddingRight: theme.spacing(2.5),
  fontSize: '0.8rem',
  color: theme.palette.text.secondary,
  '&:before': {
    top: 0,
    right: 0,
    width: 3,
    bottom: 0,
    content: "''",
    display: 'none',
    position: 'absolute',
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    backgroundColor: 'theme.palette.primary.main'
  }
}));

const ListItemIconStyle = styled(ListItemIcon)({
  width: 10,
  height: 12,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
});

// ----------------------------------------------------------------------

function NavItem({ item, active, isPending }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const { pathname } = useLocation();
  const getMenuTitle = (title) => title.split('/')[0]?.split(' ').join('-').toLocaleLowerCase();
  let isActiveRoot = active(item.path);
  const isActive =
    isActiveRoot ||
    pathname.includes(getMenuTitle(item.title)) ||
    (isArray(item.children) ? item.children.some((el) => el.path === pathname) : false);
  const { title, path, info, children, icon } = item;
  const [open, setOpen] = useState(isActive);

  const handleOpen = () => {
    setOpen((prev) => !prev);
  };

  const activeRootStyle = {
    color: '#0188a8',
    fontWeight: 'fontWeightMedium',
    bgcolor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
    '&:before': { display: 'block' }
  };

  const activeSubStyle = {
    color: '#0188a8',
    fontWeight: 'fontWeightMedium'
  };

  if (isArray(children)) {
    children?.map((childrenItem) => {
      if (active(childrenItem.path)) {
        isActiveRoot = true;
        // if (!open) setOpen(isActiveRoot);
      }
      return null;
    });
    return (
      <>
        <ListItemStyle
          onClick={handleOpen}
          sx={{
            ...(isActiveRoot && activeRootStyle)
          }}
        >
          <ListItemIconStyle>{icon && icon}</ListItemIconStyle>
          <ListItemText
            disableTypography
            primary={t([title])}
            style={{ textDecoration: `${isPending ? 'line-through' : ''}`, fontFamily: 'Montserrat' }}
          />
          {info && info}
          <Box
            component={Icon}
            icon={open ? arrowIosDownwardFill : arrowIosForwardFill}
            sx={{ width: 16, height: 16, ml: 1 }}
          />
        </ListItemStyle>

        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {children?.map((item) => {
              const isActiveSub = active(item.path);

              return (
                <ListItemStyle
                  key={item.title}
                  component={RouterLink}
                  to={item.path}
                  sx={{
                    ...(isActiveSub && activeSubStyle)
                  }}
                >
                  <ListItemIconStyle>
                    <Box
                      component="span"
                      sx={{
                        width: 4,
                        height: 4,
                        display: 'flex',
                        borderRadius: '50%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'text.disabled',
                        transition: (theme) => theme.transitions.create('transform'),
                        ...(isActiveSub && {
                          transform: 'scale(2)',
                          bgcolor: theme.palette.primary.main
                        })
                      }}
                    />
                  </ListItemIconStyle>
                  <ListItemText
                    disableTypography
                    primary={t([item.title])}
                    style={{ textDecoration: `${item.isPending ? 'line-through' : ''}`, fontFamily: 'Montserrat' }}
                  />
                </ListItemStyle>
              );
            })}
          </List>
        </Collapse>
      </>
    );
  }

  return (
    <ListItemStyle
      component={RouterLink}
      to={path}
      sx={{
        ...(isActiveRoot && activeRootStyle)
      }}
    >
      <ListItemIconStyle>{icon && icon}</ListItemIconStyle>
      <ListItemText
        disableTypography
        primary={t([title])}
        style={{ textDecoration: `${isPending ? 'line-through' : ''}`, fontFamily: 'Montserrat' }}
      />
      {info && info}
    </ListItemStyle>
  );
}

NavItem.propTypes = {
  item: PropTypes.object,
  active: PropTypes.func,
  isPending: PropTypes.bool
};

export default function NavSection({ navConfig, ...other }) {
  const { pathname } = useLocation();
  const match = (path) => (path ? !!matchPath({ path, end: false }, pathname) : false);
  return (
    <Box {...other}>
      {navConfig ? (
        navConfig.map((menu, ind) => (
          <List key={ind} disablePadding>
            <NavItem key={menu.title} item={menu} active={match} isPending={menu.isPending} />
          </List>
        ))
      ) : (
        <Typography variant="overline" ml="5rem" style={{ fontFamily: FontFamily, color: '#fff' }}>
          Loading...
        </Typography>
      )}
    </Box>
  );
}

NavSection.propTypes = {
  navConfig: PropTypes.array
};
