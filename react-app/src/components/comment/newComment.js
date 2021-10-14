import { useState } from "react"
import { useDispatch } from "react-redux"
import { AddComment } from "../../store/notes"
import { SetErrors } from "../../store/session"
import "./index.css"

const NewComment = ({note, shared}) => {

    const [comment, setComment] = useState('')
    const dispatch = useDispatch()
    const AddNewComment = () => {
        let newComment = {
            text:comment,
            note_id: note.id,
            parent_id:"N/A"
        }
       let good = dispatch(AddComment(newComment, shared))
       if(good){
           dispatch(SetErrors([`Comment added to ${note.title}`]))
           setComment("")
       }
    }

    return (
        <div className="new-comment__container">
            <input type="text" value={comment} onChange={(e)=> setComment(e.target.value)} placeholder="Comment on Note" />
            <button type="button" onClick={AddNewComment}>Post</button>
        </div>
    )
}

export default NewComment