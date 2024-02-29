import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
// material
import { experimentalStyled as styled } from '@mui/material/styles';
import { Box, Button, Typography, Container } from '@mui/material';
// components
import { MotionContainer, varBounceIn } from '../components/animate';
import Page from '../components/Page';
import { PageNotFoundIllustration } from '../assets';
import { ROUTES } from '../routes/paths';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  display: 'flex',
  minHeight: '100%',
  alignItems: 'center',
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(10)
}));

// ----------------------------------------------------------------------

export default function Page404() {
  const navigate = useNavigate();
  return (
    <RootStyle>
      <Container style={{ marginTop: '-6rem' }}>
        <MotionContainer initial="initial" open>
          <Box sx={{ maxWidth: 480, margin: 'auto', textAlign: 'center' }}>
            <motion.div variants={varBounceIn}>
              <Typography variant="h3" paragraph>
                Sorry, page not found!
              </Typography>
            </motion.div>
            <Typography sx={{ color: 'text.secondary' }}>
              Sorry, we couldn’t find the page you’re looking for. Perhaps you’ve mistyped the URL? Be sure to check
              your spelling.
            </Typography>

            <motion.div variants={varBounceIn}>
              <PageNotFoundIllustration sx={{ height: 230, my: { xs: 5, sm: 10 } }} />
            </motion.div>

            <Button size="large" variant="contained" onClick={() => navigate(ROUTES.HOME)}>
              Go to Home
            </Button>
          </Box>
        </MotionContainer>
      </Container>
    </RootStyle>
  );
}
