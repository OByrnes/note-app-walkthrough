import { SetErrors } from "./session"

const ADD_NOTE= "notes/ADD_NOTE"
const EDIT_NOTE="notes/EDIT_NOTE"
export const SET_NOTES = "notes/SET_NOTES"
const DELETE_NOTE = "notes/DELETE_NOTE"

const SET_CURRENT_NOTE = "notes/SET_CURRENT_NOTE"
const CLEAR_CURRENT_NOTE = "notes/CLEAR_CURRENT_NOTE"

const SHARE_NOTE = "notes/SHARE_NOTE"
const SET_SHARED = "notes/SET_SHARED_NOTES"
const EDIT_SHARED = "notes/EDIT_SHARED_NOTES"

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

const shareNoteAction = (user) => ({
  type: SHARE_NOTE,
  payload: user
})

export const setSharedNotes = (notes) => ({
  type: SET_SHARED,
  payload: notes
})

export const editSharedNote = (note) => ({
  type: EDIT_SHARED,
  payload: note
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
export const shareNote = (username, id) => async dispatch => {
  const response = await fetch(`/api/share/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
       username
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
  }else{
    dispatch(SetErrors(["Something went wrong. Please try again"]))
  }
}

export const unShareNote = (username, id) => async dispatch => {
  const response = await fetch(`/api/share/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
       username
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
  }else{
    dispatch(SetErrors(["Something went wrong. Please try again"]))
  }
}

export const AddComment = (comment, share) => async dispatch => {
  const response = await fetch('/api/comments/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(comment)
    })
    if(response.ok){
        let resJSON = await response.json()
        if(resJSON.errors){
            dispatch(SetErrors(resJSON.errors))
        }else{
          if(share){
            dispatch(editSharedNote(resJSON))

          }else{
            dispatch(editNote(resJSON))
          }
          
          return "good"
        }
    }
}

export const EditComment = (comment, share) => async dispatch => {
  const response = await fetch(`/api/comments/${comment.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(comment)
    })
    if(response.ok){
        let resJSON = await response.json()
        if(resJSON.errors){
            dispatch(SetErrors(resJSON.errors))
        }else{
          if(share){
            dispatch(editSharedNote(resJSON))

          }else{
            dispatch(editNote(resJSON))
          }
          
          return "good"
        }
    }
}

export const deleteComment = (comment,note_id, share) => async dispatch => {
  const response = await fetch(`/api/comments/${comment.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        note_id
      })
    })
    if(response.ok){
        let resJSON = await response.json()
        if(resJSON.errors){
            dispatch(SetErrors(resJSON.errors))
        }else{
          if(share){
            dispatch(editSharedNote(resJSON))

          }else{
            dispatch(editNote(resJSON))
          }
          
          return "good"
        }
    }
}




const initialState = {all:{}, current:{}, shared: {}}
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
    case SET_SHARED:
      newState = {...state}
      newState.shared = action.payload
      return newState
    case EDIT_SHARED:
      newState = {... state}
      newState.shared[action.payload.id] = action.payload
      return newState
    
    // case SHARE_NOTE:
    //   newState = {...state}
    //   newState.current = newState.all[action.payload.id]
    //   newState.current.shared.push(action.payload.username)
    default:
      return state;
  }
}
