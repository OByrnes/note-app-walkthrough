import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { shareNote } from '../store/notes';
import { SetErrors } from '../store/session';

function UsersList({note}) {
  const [users, setUsers] = useState([]);
  const [showDropDown, setShowDropDown] = useState(false)
  const user = useSelector(state => state.session.user)
  useEffect(() => {
    async function fetchData() {
      const response = await fetch('/api/users/');
      const responseData = await response.json();
      const userList = responseData.users.filter(username => (!note.shared?.includes(username.username))&&user.username !== username.username )
      setUsers(userList);
    }
    fetchData();
  }, [note]);

  const showDropDownFunc = (e) => {
    e.preventDefault()
    setShowDropDown(true)   
}
const hideDropDown = (e) => {
    e.preventDefault()
    setShowDropDown(false)
    document.removeEventListener('click', hideDropDown)
}
useEffect(()=>{
    if(showDropDown){
        document.addEventListener('click', hideDropDown)
    }
    else{
         document.removeEventListener('click', hideDropDown)}
    
},[showDropDown])
  const dispatch = useDispatch()

  const shareWithUser = async (username) => {

    const good = await dispatch(shareNote(username, note.id))
    if(good){
      dispatch(SetErrors([`Note was shared with ${username}`]))
    }

  }

  const userComponents = users.length? users.map((user) => {
    
    return (
      <li key={user.usersname}>
        <span onClick={()=>shareWithUser(user.username)}>{user.username}</span>
      </li>
    );
  }): <li>No more users to share with</li>;

  return (
    <div className="dropdown__container">
      <button onClick={showDropDownFunc}>{"Share with..."}</button>
      {showDropDown && <ul className="dropdown">{userComponents}</ul>}
    </div>
    
  )
}

export default UsersList;
