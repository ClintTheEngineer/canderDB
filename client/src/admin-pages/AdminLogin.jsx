import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { SignupButton } from '../components/SignupButton';
import { HomeButton } from '../components/HomeButton';
import PropTypes from 'prop-types';

export const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [token, setToken] = useState('');
    const navigate = useNavigate();
    const appName = 'CanderDB';

    AdminLogin.propTypes = {
      setToken: PropTypes.func.isRequired,
    };
  
    useEffect(() => {
      const token = localStorage.getItem('token')
     if(token){
      navigate('/admin-instances')
     }
     }, [navigate])
  
    const HandleLogin = async () => {
      try {
        const authHeader = `Bearer ${token}`;
        const response = await fetch('http://localhost:3333/admin-login', {
          method: 'POST',
          headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        });
  
        const data = await response.json();
        if (response.status === 200) {
          const token = data.token;
          setToken(token);
          setEmail(email);
          localStorage.setItem('token', token);
          localStorage.setItem('email', email);
          navigate('/admin-instances');
        } else if(response.status === 400){
          setErrorMessage('Login failed')
          console.error('Login failed:', response.status)
        } else if(response.status === 401){
          setErrorMessage('Incorrect username/password.')
        }
      } catch (error) {
        console.error(error);
      }
    };
  
    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        HandleLogin()
      }
    };
  
  
  
    return (
      <>
        <HomeButton />
        <SignupButton />
        <h2 id='login-hdr' className='app-name'>{appName}</h2>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyUp={handleKeyPress}
        />
        <button id='login-btn' onClick={HandleLogin} onKeyUp={handleKeyPress}>Login</button>
        <Link id='reset-pswd' title='Click here to reset your password' to="/forgot-password">Forgot Password</Link>
        <p>{errorMessage}</p>
      </>
    );
  }

  AdminLogin.propTypes = {
    setToken: PropTypes.string.isRequired
  }
  