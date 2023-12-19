import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Stack, AppBar, Toolbar, IconButton } from '@mui/material';
// utils
import { bgBlur } from '../../../utils/cssStyles';
// components
import Iconify from '../../../components/iconify';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import globalUser from '../../../../global-data';
import mapApiDataToUser from '../../../../model-mapping-function';
//
//import Searchbar from './Searchbar';
//import AccountPopover from './AccountPopover';
//import LanguagePopover from './LanguagePopover';
//import NotificationsPopover from './NotificationsPopover';

// ----------------------------------------------------------------------

const NAV_WIDTH = 280;

const HEADER_MOBILE = 64;

const HEADER_DESKTOP = 92;

const StyledRoot = styled(AppBar)(({ theme }) => ({
  ...bgBlur({ color: theme.palette.background.default }),
  boxShadow: 'none',
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${NAV_WIDTH + 1}px)`,
  },
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  minHeight: HEADER_MOBILE,
  [theme.breakpoints.up('lg')]: {
    minHeight: HEADER_DESKTOP,
    padding: theme.spacing(0, 5),
  },
}));

// ----------------------------------------------------------------------

Header.propTypes = {
  onOpenNav: PropTypes.func,
};

export default function Header({ onOpenNav }) {
  const navigate = useNavigate();

  const handleNavigate = (e) => {
    navigate(`${e}`);
  };

  const handleLogout = () => {
    globalUser.setUserModel(null);
    handleNavigate("/signin");
  }
  const handleSwitch = () => {
    if (globalUser.userModel) {
      const userType = "user";
      const mappedUser = mapApiDataToUser(globalUser.userModel, userType);
      globalUser.setUserModel(mappedUser);

      // Redirect to dashboard-labor/app when loginAsPro is true
      if (globalUser.userModel.loginAsPro === true) {
        handleNavigate('/home');
      }
    }
  };
  const handleProSwtich = () => {
    const userType = "labour";
    const mappedUser = mapApiDataToUser(globalUser.userModel, userType);
    globalUser.setUserModel(mappedUser);
    console.log(globalUser.userModel);
    // Redirect to dashboard-labor/app when loginAsPro is true
    if (!globalUser.userModel.loginAsPro) {
      handleNavigate('/dashboard-labor/app');
    }
  };
  return (
    <StyledRoot>
      <StyledToolbar>
        <IconButton
          onClick={onOpenNav}
          sx={{
            mr: 1,
            color: 'text.primary',
            display: { lg: 'none' },
          }}
        >
          <Iconify icon="eva:menu-2-fill" />
        </IconButton>

        {/* <Searchbar /> */}
        <Box sx={{ flexGrow: 1 }} />

        <Stack
          direction="row"
          alignItems="center"
          spacing={{
            xs: 0.5,
            sm: 1,
          }}
        > 
          {globalUser.userModel && !globalUser.userModel.loginAsPro  && globalUser.userModel.isPro && (
                <>
                  <Button variant="outlined" color='primary' onClick={() => handleProSwtich()}>
                    Switch to pro
                  </Button>
                </>
          )}
          {globalUser.userModel && globalUser.userModel.loginAsPro && (
            <Button variant="outlined" color='primary' onClick={handleSwitch}>
              Switch to User
            </Button>
          )}
          {(!globalUser.userModel || !globalUser.userModel.loginAsPro) && (
            <Button variant="outlined" color="primary" sx={{ textTransform: 'none' }} onClick={() => handleNavigate("/home")}>
              Home
            </Button>
          )}
          <Button variant="outlined" color="error" sx={{ textTransform: 'none' }} onClick={() => handleLogout()}>Logout</Button>
          {/* <LanguagePopover /> */}
          {/* <NotificationsPopover /> */}
          {/* <AccountPopover /> */}
        </Stack>
      </StyledToolbar>
    </StyledRoot>
  );
}
