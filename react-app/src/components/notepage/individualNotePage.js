import { useEffect, useState } from "react"
import { useParams, useHistory } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import Editor from "rich-markdown-editor"
import { AddNote, deleteNoteThunk, EditSavedNote, setNoteCurrent, unShareNote } from "../../store/notes"
import NewComment from "../comment/newComment"
import Comment from "../comment/comment"
import { SetErrors } from "../../store/session"
import "./index.css"
import UsersList from "../UsersList"

const IndividualNotePage = () => {
    const user = useSelector(state => state.session.user)
    const note = useSelector(state => state.notes.current)
    const [title, setTitle] = useState("")
    const [text, setText] = useState("")
    const [date, setDate] = useState(new Date().toISOString().slice(0,16))
    const [viewComments, setViewComments] = useState(false)
    const [confirmButton, setConfirmButton] = useState(true)
    const dispatch = useDispatch()
    const history = useHistory()
    const {id} = useParams()
    useEffect(()=>{
        if(id !== "new"){
            dispatch(setNoteCurrent(id))
        }else{
            setTitle("")
            setText("")
            setDate(new Date().toISOString().slice(0,16))
        }
    },[id])
    const deleteFunction = async () =>{
        dispatch(deleteNoteThunk(id))
        history.push("/notes")
    }
    useEffect(()=>{
        if(id !== "new" && note.date){
            setText(note.text)
            setTitle(note.title)
            setDate( new Date(note.date).toISOString().slice(0,16))
        }

    },[note])

    const saveNote = async (e) => {
        e.preventDefault()
        let newNote = {
            title,
            date,
            text
        }
        let good;
        if(id !== "new"){
            newNote.id = note.id
            good = await dispatch(EditSavedNote(newNote))
            
        }else{
            good = await dispatch(AddNote(newNote))
        }
        if(good){
            await dispatch(SetErrors(["Note was Saved"]))
            history.push("/notes")
        }
    }

    const unshare = async (username) => {
        let good = await dispatch(unShareNote(username, note.id))
        if(good){
            dispatch(SetErrors([`You unshared your note with ${username}`]))
        }
    }
    
    return (
        <div className="note-outer__container">
            <form>
                <div className="note-header__container">
                    <input type="text" value={title} placeholder="Title" onChange={(e)=>setTitle(e.target.value)} />
                    <input type="datetime-local"  value={date} onChange={(e)=> setDate(e.target.value)}/>
                    {(note && id !== "new") && <UsersList note={note} />}
                </div>
                <div className="editor-container">
                    {(id === "new" || text) && <Editor defaultValue={text} onChange={(e)=> setText(e())} dark/>}
                </div>
            </form>
            <div className="button__container">
                <button onClick={(e)=>saveNote(e)}>Save Changes</button>
            {confirmButton? <button onClick={()=>setConfirmButton(false)}>Delete</button> : <div><h5>Are you sure you want to delete this note?</h5><button onClick={deleteFunction}>Yes</button><button onClick={()=>setConfirmButton(true)}>No</button></div>}
            </div>
            {((note && note.comments) && Object.values(note.comments).length !== 0) && <button onClick={()=>setViewComments((prev)=>!prev)} >{viewComments? 'Hide Comments' : "View Comments"}</button>}
            {viewComments && <div>
                {Object.values(note.comments).map(comment => (
                    <Comment key={comment.id} comment={comment} note={note}/>
                ))}
                </div>}
            <NewComment note={note} shared={false} />
            
            <div className="shared__container">
                <h4>Shared with:</h4>
                <div>
                {(note && note.shared) && note.shared.map( user => (
                <span title="Unshare" key={user} onClick={()=>unshare(user)}>{user}</span>))}
                </div>
                </div>
        </div>
    )
}

export default IndividualNotePage