// material
import { experimentalStyled as styled } from '@mui/material/styles';
import { Container } from '@mui/material';
import Page from '../../components/Page';
import LoginForm from '../../components/authentication/login/LoginForm';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex'
  },
  backgroundColor: theme.palette.primary.contrastText
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0)
}));

// ----------------------------------------------------------------------

export default function Login() {
  return (
    <RootStyle title="Reza Hygiene OMS">
      {/* <MHidden width="mdDown">
        <SectionStyle>
          <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
            Hi, Welcome Back
          </Typography>
          <img src="/static/home/rezaLogo.png" alt="reza" style={{ padding: '0 1.1rem 0 1.1rem' }} />
          <img src="/static/home/omslogo.png" alt="oms" />
        </SectionStyle>
      </MHidden> */}
      <Container maxWidth="sm">
        <ContentStyle>
          <LoginForm />
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
