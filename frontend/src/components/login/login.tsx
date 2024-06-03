import { useEffect, useCallback, useContext, useState } from 'react'
import Alert from '@mui/material/Alert';
import { useLocation, useNavigate } from "react-router-dom";
import Avatar from '@mui/material/Avatar';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';


//import { Form, Button, Message } from 'semantic-ui-react'

import { User } from '../../Shared/Models'
import { UserContainer } from '../../Shared/UserContainer'


function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
         Athletes rating
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();


const LogInForm = () => {
  const location = useLocation()
  const { user, setUser } = useContext(UserContainer)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  //  const { fields, handleChange, setFields } = useFields({} as User)
  const navigate = useNavigate();

  /*
  useEffect(() => {
    if (user.id) {
      navigate("/posts", { replace: true})
    }
  }, [user, navigate])
  */

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {

    event.preventDefault();
    const data = new FormData(event.currentTarget)
   
    setLoading(true);
    setError("");
    try {
      const response = await fetch("api/session",
          {
            method:"POST",
            headers: {
              "X-Requested-With": "XMLHttpRequest", // Замените 'Bearer your-token' на ваш токен авторизации
            },
            body: JSON.stringify({email:data.get('email'), pass:data.get('password')}),
          }
        );
  
        if (!response.ok) {
          setError('Неверный логин или пароль');  
        } else {
     
          const user = await response.json();
          if (user.id) {
            setUser(user);
            const { from } = location.state || { from: { pathname: "/category" } };
            navigate(from);
          } 
        }
      } catch (error) {
        setError(`Ошибка соединения`);
    }
  
    setLoading(false);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
              Вход
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
   
            <Button
              type="submit"
              disabled={loading}
            
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? 'Вход...' : 'Войти'}
            </Button>
         
            {loading && <CircularProgress size={24} />}

            {(error!=='') &&<Alert severity="error">{error}</Alert>}
         
          </Box>
        </Box>

        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  )
}

export default LogInForm;
