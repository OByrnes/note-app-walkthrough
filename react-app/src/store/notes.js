import { SetErrors } from "./session"

const ADD_NOTE= "stories/ADD_NOTE"
const EDIT_NOTE="stories/EDIT_NOTE"
export const SET_NOTES = "stories/SET_NOTES"
const DELETE_NOTE = "stories/DELETE_NOTE"

const SET_CURRENT_NOTE = "stories/SET_CURRENT_NOTE"
const CLEAR_CURRENT_NOTE = "stories/CLEAR_CURRENT_NOTE"


export const setUserNotes = (notes) =>({
    type: SET_NOTES,
    payload: notes
})

const AddNewNote = (note) =>({
    type: ADD_NOTE,
    payload: note
})


const setCurrentNote = (note) => ({
  type: SET_CURRENT_NOTE,
  payload: note
})

const editNote = (note) => ({
  type: EDIT_NOTE,
  payload:  note
})

const deleteNote = (id) => ({
    type: DELETE_NOTE,
    payload: id
})

export const clearCurrent = () => ({
  type: CLEAR_CURRENT_NOTE,
  payload: null
})


export const AddNote = (note) => async dispatch => {
  const response = await fetch('/api/notes/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
       text: note.text,
       title: note.title,
       date: note.date
      })
    })
    if(response.ok){
        let resJSON = await response.json()
        if(resJSON.errors){
            dispatch(SetErrors(resJSON.errors))
        }else{
          dispatch(AddNewNote(resJSON))
          return "good"
        }
    }

}

export const GetAllNotes = () => async dispatch => {
  const response = await fetch(`/api/notes/`)
  if (response.ok){
    let resJSON = await response.json()
    if(resJSON.errors){
        dispatch(SetErrors(resJSON.errors))
    }else{
     dispatch(setUserNotes(resJSON))
     return "good"
    }
  }
}

export const EditSavedNote = (note) => async dispatch => {
const response = await fetch(`/api/notes/${note.id}`, {
    method: 'PATCH',
    headers: {
        'Content-Type': 'application/json'
      },
    body: JSON.stringify({
       text: note.text,
       title: note.title,
       date: note.date
      })
  })
  if(response.ok){
      let resJSON = await response.json()
      if(resJSON.errors){
          dispatch(SetErrors(resJSON.errors))
      }else{
        dispatch(editNote(resJSON))
        return "good"
      }
  }

}



export const setNoteCurrent = (id) => async dispatch => {
    const response = await fetch(`/api/notes/${id}`)
  if (response.ok){
    let resJSON = await response.json()
    if(resJSON.errors){
        dispatch(SetErrors(resJSON.errors))
    }else{
        dispatch(setCurrentNote(resJSON))
        return "good"
    }
  }
}

export const deleteNoteThunk = (id) => async dispatch => {
    const response = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
          }
    })
    if (response.ok){
        let resJSON = await response.json()
        if(resJSON.errors){
            dispatch(SetErrors(resJSON.errors))
        }else{
            dispatch(deleteNote(resJSON.delete))
            return "good"
        }
      }else{
          dispatch(SetErrors(["Ooops, Something went wrong"]))
      }
}

const initialState = {all:{}, current:{}}
export default function reducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    case SET_NOTES:
      newState = {...state, all:action.payload}
      return newState
    case ADD_NOTE:
      newState = {...state}
      let all = {...state.all, [action.payload.id]:action.payload}
      newState.current = action.payload
      newState.all = all
      return newState
    case EDIT_NOTE:
      newState = {...state}
      let allStories = {...state.all, [action.payload.id]:action.payload}
      newState.current = action.payload
      newState.all = allStories
      return newState
    case SET_CURRENT_NOTE:
      newState = {...state, current: action.payload}
      return newState
    case CLEAR_CURRENT_NOTE:
      newState = {...state, current: null}
      return newState
    case DELETE_NOTE:
        newState = {...state}
        delete newState.all[action.payload]
        newState.current = null
        return newState
    default:
      return state;
  }
}
