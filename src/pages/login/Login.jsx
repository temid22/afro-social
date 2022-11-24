import './login.css';
import {
  AccountCircle,
  Facebook,
  Google,
  Instagram,
  Lock,
  Twitter,
  VisibilityOffOutlined,
  VisibilityOutlined,
} from '@mui/icons-material';
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom/dist';

const Login = () => {
  const [err, setErr] = useState(false);
  const [showPassword, setShowPassord] = useState(false);

  const handleTogglePassword = () => setShowPassord(true);
  const handleTogglePassword2 = () => setShowPassord(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err) {
      setErr(true);
    }
  };

  return (
    <div className='login'>
      <div className='loginContainer'>
        <div className='signinSignup'>
          {err && <span style={{ color: 'red' }}>Invalid Parameters!</span>}
          <form className='signinForm' onSubmit={handleSubmit}>
            <h1 className='signIntitle'>Sign In</h1>
            {/* {!admin && <p className="errorMessage">{errorMessage}</p>} */}
            <div className='inputField'>
              <AccountCircle className='icon' />
              <label>Email</label>
              <input
                type='text'
                placeholder=''
                className='inputItself'
                required
              />
            </div>
            <div className='inputField'>
              <Lock className='icon' />
              <label>Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                className='inputItself'
                autoComplete='off'
                required
              />{' '}
              {!showPassword ? (
                <VisibilityOffOutlined
                  className='showIcon'
                  style={{ color: 'teal' }}
                  onClick={handleTogglePassword}
                />
              ) : (
                <VisibilityOutlined
                  className='showIcon'
                  style={{ color: 'brown' }}
                  onClick={handleTogglePassword2}
                />
              )}
            </div>
            <button className='submitBtn'>Login</button>
            <p style={{ color: '#999', fontSize: 14, margin: 10 }}>
              Don't have an account?{' '}
              <Link style={{ color: 'khaki' }} to='/signup'>
                SignUp
              </Link>
            </p>
            <p className='socialText' style={{ color: '#999' }}>
              Sign in with Socials
            </p>
            <div className='socialMedia'>
              <div className='socialIcon'>
                <Facebook style={{ color: 'blue' }} />
                <Instagram style={{ color: 'maroon' }} />
                <Twitter style={{ color: 'skyblue' }} />
                <Google style={{ color: 'red' }} />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
