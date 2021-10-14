
import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import LogoutButton from './auth/LogoutButton';
import note from "../images/note.png"

const NavBar = () => {
  const user = useSelector(state => state.session.user)
  return (
    <nav>
      <ul>
        <li>
          <NavLink to='/notes' exact={true} activeClassName='active'>
            <img src={note} alt="logo" />
          </NavLink>
        </li>
       

        {user?
        <div className="button__container">
        <li><NavLink to="/">Shared Notes</NavLink></li>
        <li>
         
          <LogoutButton />
        </li> </div>:<div className="button__container"><li>
          <NavLink to='/login' exact={true} activeClassName='active'>
            Login
          </NavLink>
        </li>
        <li>
          <NavLink to='/sign-up' exact={true} activeClassName='active'>
            Sign Up
          </NavLink>
        </li></div>}
        
      </ul>
    </nav>
  );
}

export default NavBar;
