import NewComment from "../comment/newComment"
import Comment from "../comment/comment"
import NoteThumbnail from "../notepage/noteThumbnail"
import { useState } from "react"

const SharedNoteThumbnail = ({note}) => {
    const [showComments, setShowComments] = useState(false)
    return (
        <div key={`${note.shared_by}+${note.title}`} className="sharedNote__container">
                <NoteThumbnail  note={note} />
                <p>Shared by: {note.shared_by}</p>
                {Object.values(note.comments).length !== 0 && <button onClick={()=>setShowComments(prev => !prev)}>{showComments? "hide comments": "show comments"}</button>}
                {showComments && Object.values(note.comments).map(comment => (
                    <Comment comment={comment} note={note} key={comment.id} />
                )
                )}
                <NewComment note={note} shared={true} />
                </div>
    )
}

export default SharedNoteThumbnail