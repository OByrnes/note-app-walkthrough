import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import LoginForm from './components/auth/LoginForm';
import SignUpForm from './components/auth/SignUpForm';
import NavBar from './components/NavBar';
import ProtectedRoute from './components/auth/ProtectedRoute';
import NotesPage from './components/notepage/notespage';
import { authenticate } from './store/session';
import IndividualNotePage from './components/notepage/individualNotePage';
import ErrorComponent from './components/errors/errorComponent';
import HomePage from './components/home/home';

function App() {
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    (async() => {
      await dispatch(authenticate());
      setLoaded(true);
    })();
  }, [dispatch]);

  if (!loaded) {
    return null;
  }

  return (
    <BrowserRouter>
      <NavBar />
      <ErrorComponent />
      <Switch>
        <Route path='/login' exact={true}>
          <LoginForm />
        </Route>
        <Route path='/sign-up' exact={true}>
          <SignUpForm />
        </Route>
        <ProtectedRoute path='/' exact={true}>
          <HomePage />
        </ProtectedRoute>
        <ProtectedRoute path='/notes' exact={true} >
          <NotesPage />
        </ProtectedRoute>
        <ProtectedRoute path={`/notes/:id`} exact={true} >
          <IndividualNotePage />
        </ProtectedRoute>
        
      </Switch>
    </BrowserRouter>
  );
}

export default App;
