import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import { NavLink } from "react-router-dom"
import { GetAllNotes } from "../../store/notes"
import NoteThumbnail from "./noteThumbnail"
import "./index.css";


const NotesPage = () => {
    const notes = useSelector(state => Object.values(state.notes.all))
    const dispatch = useDispatch()
    useEffect(()=>{
        dispatch(GetAllNotes())
    },[])

    return (
        <div className="notes-page-outer__container">
            <NavLink to='/notes/new' className="plusButton">+</NavLink>
            {notes && notes.map(note => (
                <NavLink className="NoteThumbnailLink" to={`/notes/${note.id}`} key={note.id}>
                    <NoteThumbnail note={note} />
                </NavLink>
            ))}
        </div>
    )
}

export default NotesPage