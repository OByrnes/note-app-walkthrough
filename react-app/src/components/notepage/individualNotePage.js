import { useEffect, useState } from "react"
import { useParams, useHistory } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import Editor from "rich-markdown-editor"
import { AddNote, deleteNoteThunk, EditSavedNote, setNoteCurrent } from "../../store/notes"
import { SetErrors } from "../../store/session"
import "./index.css"

const IndividualNotePage = () => {
    const note = useSelector(state => state.notes.current)
    const [title, setTitle] = useState("")
    const [text, setText] = useState("")
    const [date, setDate] = useState(new Date().toISOString().slice(0,16))
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
    
    return (
        <div className="note-outer__container">
            <form>
                <div className="note-header__container">
                    <input type="text" value={title} placeholder="Title" onChange={(e)=>setTitle(e.target.value)} />
                    <input type="datetime-local"  value={date} onChange={(e)=> setDate(e.target.value)}/>
                </div>
                <div className="editor-container">
                    {(id === "new" || text) && <Editor defaultValue={text} onChange={(e)=> setText(e())} dark/>}
                </div>
                <button onClick={(e)=>saveNote(e)}>Save Changes</button>
            </form>
            {confirmButton? <button onClick={()=>setConfirmButton(false)}>Delete</button> : <div><h5>Are you sure you want to delete this note?</h5><button onClick={deleteFunction}>Yes</button><button onClick={()=>setConfirmButton(true)}>No</button></div>}
        </div>
    )
}

export default IndividualNotePage