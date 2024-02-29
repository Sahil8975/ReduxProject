import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { experimentalStyled as styled } from '@mui/material/styles';
import { Box, Button, Typography, Container } from '@mui/material';
import { MotionContainer, varBounceIn } from '../components/animate';
import Page from '../components/Page';
import { ROUTES } from '../routes/paths';

const RootStyle = styled(Page)(({ theme }) => ({
  display: 'flex',
  minHeight: '100%',
  alignItems: 'center',
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(10)
}));

export default function ComingSoon() {
  const navigate = useNavigate();
  return (
    <RootStyle>
      <Container style={{ marginTop: '-6rem' }}>
        <MotionContainer initial="initial" open>
          <Box sx={{ maxWidth: 480, margin: 'auto', textAlign: 'center' }}>
            <motion.div variants={varBounceIn}>
              <Typography variant="h3" paragraph>
                Oops!
              </Typography>
            </motion.div>
            <Typography sx={{ color: 'text.secondary' }}>
              Page is under Construction, it will be available very soon !!
            </Typography>

            <motion.div variants={varBounceIn}>
              <img src="/static/home/coming_soon.png" alt="oms" />
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
