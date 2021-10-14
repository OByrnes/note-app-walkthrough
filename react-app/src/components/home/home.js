
import { useSelector } from "react-redux"
import "./index.css"

import SharedNoteThumbnail from "./sharedNoteThumbnail"

const HomePage = () => {
    const user = useSelector(state => state.session.user)
    const sharedNotes = useSelector(state => Object.values(state.notes.shared))
    

    return (
        <div className='homepage__container'>
            <h2>Shared with me</h2>
            {sharedNotes && sharedNotes.map(note => (
                <SharedNoteThumbnail key={note.id} note={note}/>
            ))}
            
        </div>
    )
}

export default HomePage