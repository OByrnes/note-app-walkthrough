import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { login } from '../../store/session';

const LoginForm = () => {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const user = useSelector(state => state.session.user);
  const dispatch = useDispatch();
  
  const onLogin = async (e) => {
    e.preventDefault();
    const data = await dispatch(login(email, password));
    
  };

  const demoLogin = async(e) =>{
    e.preventDefault()
    await dispatch(login("demo@aa.io", "password"))
  }
  const updateEmail = (e) => {
    setEmail(e.target.value);
  };

  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  if (user) {
    return <Redirect to='/notes' />;
  }

  return (
    <form onSubmit={onLogin} className="auth-form">
      
      <div>
        <label htmlFor='email'>Email</label>
        <input
          name='email'
          type='text'
          placeholder='Email'
          value={email}
          onChange={updateEmail}
        />
      </div>
      <div>
        <label htmlFor='password'>Password</label>
        <input
          name='password'
          type='password'
          placeholder='Password'
          value={password}
          onChange={updatePassword}
        />
      </div>
      <div id="button__container" className="button__container">
        <button type='submit'>Login</button>
        <button type="button" onClick={(e)=>demoLogin(e)}>Demo User</button>
      </div>
    </form>
  );
};

export default LoginForm;
