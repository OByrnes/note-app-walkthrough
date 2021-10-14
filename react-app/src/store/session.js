import { setSharedNotes } from "./notes";

// constants
const SET_USER = 'session/SET_USER';
const REMOVE_USER = 'session/REMOVE_USER';
const SET_ERRORS = 'session/SET_ERRORS'


const setUser = (user) => ({
  type: SET_USER,
  payload: user
});

const removeUser = () => ({
  type: REMOVE_USER,
})

export const SetErrors = (errors) => ({
  type: SET_ERRORS,
  payload: errors
})


export const authenticate = () => async (dispatch) => {
  const response = await fetch('/api/auth/', {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (response.ok) {
    const data = await response.json();
    if (data.errors) {
      dispatch(SetErrors(data.errors))
    }else{
      dispatch(setUser(data));
      dispatch(setSharedNotes(data.shared_notes))

    }
  
  }
}

export const login = (email, password) => async (dispatch) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email,
      password
    })
  });
  
  if (response.ok) {
    const data = await response.json();
    if (data.errors) {
      dispatch(SetErrors(data.errors))
    }else{
      dispatch(setUser(data))
      dispatch(setSharedNotes(data.shared_notes))
      return "good"
    }
  } else {
    dispatch(SetErrors(["Something went wrong, please try again"]))
  }

}

export const logout = () => async (dispatch) => {
  const response = await fetch('/api/auth/logout', {
    headers: {
      'Content-Type': 'application/json',
    }
  });

  if (response.ok) {
    dispatch(removeUser());
  }
};


export const signUp = (username, email, password) => async (dispatch) => {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      email,
      password,
    }),
  });
  
  if (response.ok) {
    const data = await response.json();
    if(data.errors){
      dispatch(SetErrors(data.errors))
    }else{
      dispatch(setUser(data))
      return "good"
    }
  } else {
    dispatch(SetErrors(['An error occurred. Please try again.']))
  }
}
const initialState = {user:null, errors:null}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return { user: action.payload, errors:null }
    case REMOVE_USER:
      return { user: null, errors:null }
    case SET_ERRORS:
      let newState = {...state, errors:action.payload}
      return newState
    default:
      return state;
  }
}
